"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  calendarEvents,
  eventCategories,
  eventModes,
  type CalendarEvent,
} from "@/shared/calendar";
import CalendarView from "../calendar-view";
import { readLegacyMigrationEvents } from "../draft-storage";

type CalendarApiPayload = {
  events: CalendarEvent[];
  migrationCompleted: boolean;
};

function withChinaOffset(value: string) {
  return `${value}:00+08:00`;
}

function dateTimeInputValue(value?: string) {
  return value ? value.slice(0, 16) : "";
}

function blobToDataUrl(file: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function posterFileToBlob(file: File) {
  return new Promise<Blob>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      try {
        const maxDimension = 1600;
        const scale = Math.min(
          1,
          maxDimension / Math.max(image.naturalWidth, image.naturalHeight),
        );
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext("2d");

        if (!context) throw new Error("无法处理活动海报");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error("无法处理活动海报"))),
          "image/webp",
          0.82,
        );
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("无法读取活动海报"));
    };
    image.src = objectUrl;
  });
}

async function readApiPayload(response: Response) {
  const payload = (await response.json()) as CalendarApiPayload & {
    error?: string;
  };
  if (!response.ok) throw new Error(payload.error || "操作失败，请稍后再试。");
  return payload;
}

function downloadBackup(events: CalendarEvent[]) {
  const backup = JSON.stringify(
    { exportedAt: new Date().toISOString(), events },
    null,
    2,
  );
  const url = URL.createObjectURL(
    new Blob([backup], { type: "application/json;charset=utf-8" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `ecc-calendar-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export default function EventManager() {
  const [events, setEvents] = useState<CalendarEvent[]>(calendarEvents);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState("");
  const [legacyEvents, setLegacyEvents] = useState<CalendarEvent[] | null>(null);
  const [migrationCompleted, setMigrationCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    const localEvents = readLegacyMigrationEvents();
    const controller = new AbortController();

    fetch("/api/calendar/events", { signal: controller.signal })
      .then(readApiPayload)
      .then((payload) => {
        setLegacyEvents(localEvents);
        setMigrationCompleted(payload.migrationCompleted);
        setEvents(
          localEvents?.length && !payload.migrationCompleted
            ? localEvents
            : payload.events,
        );
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLegacyEvents(localEvents);
        if (localEvents?.length) setEvents(localEvents);
        setFormError(error instanceof Error ? error.message : "暂时无法连接活动资料库。");
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, []);

  const migrationPending = Boolean(legacyEvents?.length && !migrationCompleted);

  function startEditing(event: CalendarEvent) {
    if (migrationPending) {
      setFormError("请先迁移本机已有活动，再进行修改。");
      return;
    }
    setEditingEvent(event);
    setPosterPreview(event.cover);
    setSaved(false);
    setFormError("");
    window.setTimeout(() => {
      document.getElementById("event-editor")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  async function deleteEvent(event: CalendarEvent) {
    if (migrationPending) {
      setFormError("请先迁移本机已有活动，再进行删除操作。");
      return;
    }
    const confirmed = window.confirm(`确定删除“${event.title}”吗？`);
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/calendar/events/${encodeURIComponent(event.id)}`, {
        method: "DELETE",
      });
      await readApiPayload(response);
      setEvents((current) => current.filter((item) => item.id !== event.id));
      if (editingEvent?.id === event.id) setEditingEvent(null);
      setFormError("");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "活动删除失败。");
    }
  }

  async function previewPoster(file: File | undefined) {
    if (!file || file.size === 0) return;

    if (file.size > 5_000_000) {
      setFormError("活动海报原文件请控制在 5 MB 以内。");
      return;
    }

    try {
      setPosterPreview(await blobToDataUrl(await posterFileToBlob(file)));
      setFormError("");
    } catch {
      setFormError("这张海报无法读取，请换一张 PNG、JPG 或 WebP 图片。");
    }
  }

  async function submitEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (migrationPending) {
      setFormError("请先完成上方的本机活动迁移，再保存修改。");
      return;
    }
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const id = editingEvent?.id ?? `local-${Date.now()}`;
    const priceType = String(form.get("priceType")) as CalendarEvent["priceType"];
    const registrationUrl = String(form.get("registrationUrl")).trim();
    const qrFile = form.get("registrationQrCode");
    const hasQrFile = qrFile instanceof File && qrFile.size > 0;
    const retainedQrCode = editingEvent?.registrationQrCode;
    const coverFile = form.get("coverUpload");
    const hasCoverFile = coverFile instanceof File && coverFile.size > 0;
    const coverUrl = String(form.get("cover")).trim();

    if (hasQrFile && qrFile.size > 1_500_000) {
      setFormError("二维码图片请控制在 1.5 MB 以内。");
      return;
    }

    if (hasCoverFile && coverFile.size > 5_000_000) {
      setFormError("活动海报原文件请控制在 5 MB 以内。");
      return;
    }

    let uploadedCover: Blob | undefined;
    try {
      uploadedCover = hasCoverFile
        ? await posterFileToBlob(coverFile)
        : undefined;
    } catch {
      setFormError("这张海报无法读取，请换一张 PNG、JPG 或 WebP 图片。");
      return;
    }
    const description = String(form.get("description"))
      .split("\n")
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    const managedEvent: CalendarEvent = {
      id,
      slug: editingEvent?.slug ?? id,
      title: String(form.get("title")),
      category: String(form.get("category")) as CalendarEvent["category"],
      mode: String(form.get("mode")) as CalendarEvent["mode"],
      startAt: withChinaOffset(String(form.get("startAt"))),
      endAt: withChinaOffset(String(form.get("endAt"))),
      city: String(form.get("city")) || undefined,
      venue: String(form.get("venue")),
      address: String(form.get("address")) || undefined,
      organizer: editingEvent?.organizer ?? "北雍文化商业智库",
      summary: String(form.get("summary")),
      description: description.length ? description : [String(form.get("summary"))],
      highlights: editingEvent?.highlights ?? [],
      audience: editingEvent?.audience ?? "",
      cover:
        coverUrl ||
        editingEvent?.cover ||
        "/assets/chinese-armillary-sphere-transparent.svg",
      priceType,
      priceCny:
        priceType === "paid" ? Number(form.get("priceCny")) || 0 : undefined,
      capacity: Number(form.get("capacity")) || undefined,
      registrationStatus: editingEvent?.registrationStatus ?? "open",
      registrationUrl: registrationUrl || undefined,
      registrationQrCode: retainedQrCode,
      demo: false,
    };

    try {
      const requestBody = new FormData();
      requestBody.set(
        "event",
        JSON.stringify({
          ...managedEvent,
          previousCover: editingEvent?.cover,
          previousQrCode: editingEvent?.registrationQrCode,
        }),
      );
      if (uploadedCover) requestBody.set("poster", uploadedCover, "poster.webp");
      if (hasQrFile) requestBody.set("registrationQrCode", qrFile);

      const response = await fetch(`/api/calendar/events/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: requestBody,
      });
      const payload = (await response.json()) as { event?: CalendarEvent; error?: string };
      if (!response.ok || !payload.event) {
        throw new Error(payload.error || "活动保存失败。");
      }
      setEvents((current) => {
        const next = current.filter((item) => item.id !== payload.event?.id);
        return [...next, payload.event as CalendarEvent].sort((a, b) => a.startAt.localeCompare(b.startAt));
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "活动保存失败。");
      return;
    }
    setEditingEvent(null);
    setPosterPreview(null);
    setSaved(true);
    setFormError("");
    formElement.reset();
  }

  async function migrateLegacyEvents() {
    if (!legacyEvents?.length) return;
    setIsMigrating(true);
    setFormError("");
    try {
      downloadBackup(legacyEvents);
    } catch {
      // The server stores another full backup before migration, so a browser
      // download restriction must not prevent the actual migration request.
    }

    try {
      const response = await fetch("/api/calendar/migrate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ events: legacyEvents }),
      });
      const payload = await readApiPayload(response);
      setEvents(payload.events);
      setMigrationCompleted(true);
      setSaved(true);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "本机活动迁移失败。");
    } finally {
      setIsMigrating(false);
    }
  }

  return (
    <div className="event-manager">
      <section className={`event-storage-status${migrationPending ? " is-pending" : " is-ready"}`}>
        <div>
          <p className="eyebrow">LOCAL MANAGEMENT</p>
          <h2>{migrationPending ? "迁移本机已有活动" : "活动资料保存在本地管理环境"}</h2>
          <p>
            {migrationPending
              ? `检测到本机保存的 ${legacyEvents?.length ?? 0} 项活动。迁移前会自动下载一份完整备份；迁移完成后，本机旧数据仍会保留。`
              : "这里的修改只保存在当前电脑的开发数据库和图片空间，不会直接改变 GitHub Pages 上的官网。确认后再生成静态版本并发布。"}
          </p>
        </div>
        <div className="event-storage-actions">
          {legacyEvents?.length ? (
            <button
              className="button"
              onClick={() => downloadBackup(legacyEvents)}
              type="button"
            >
              下载本机备份
            </button>
          ) : null}
          {migrationPending ? (
            <button
              className="button button-primary"
              disabled={isMigrating}
              onClick={migrateLegacyEvents}
              type="button"
            >
              {isMigrating ? "正在安全迁移……" : "备份并迁移到云端"}
            </button>
          ) : null}
        </div>
        {formError && migrationPending ? (
          <p className="event-storage-error" role="alert">{formError}</p>
        ) : null}
      </section>

      <section className="event-manager-calendar" aria-label="活动管理日历">
        <div className="event-manager-section-heading">
          <div>
            <p className="eyebrow">MANAGE EVENTS</p>
            <h2>选择需要操作的活动</h2>
          </div>
          <button
            className="button"
            disabled={migrationPending || isLoading}
            onClick={() => {
              setEditingEvent(null);
              setPosterPreview(null);
              setSaved(false);
              setFormError("");
              document.getElementById("event-editor")?.scrollIntoView({ behavior: "smooth" });
            }}
            type="button"
          >
            {isLoading ? "正在连接……" : "新建活动"}
          </button>
        </div>
        <CalendarView
          events={events}
          managementMode
          onDelete={deleteEvent}
          onEdit={startEditing}
        />
      </section>

      <section className="event-manager-editor" id="event-editor">
        <div className="event-manager-section-heading">
          <div>
            <p className="eyebrow">EVENT EDITOR</p>
            <h2>{editingEvent ? "修改活动" : "新增活动"}</h2>
          </div>
          {editingEvent ? (
            <button
              className="event-editor-cancel"
              onClick={() => {
                setEditingEvent(null);
                setPosterPreview(null);
                setFormError("");
              }}
              type="button"
            >
              取消修改
            </button>
          ) : null}
        </div>

        <form
          className="event-manager-form"
          key={editingEvent?.id ?? "new-event"}
          onSubmit={submitEvent}
        >
          <div className="event-manager-field event-manager-field-wide">
            <label htmlFor="event-title">活动题目</label>
            <input defaultValue={editingEvent?.title} id="event-title" name="title" required />
          </div>

          <div className="event-manager-field">
            <label htmlFor="event-category">活动类型</label>
            <select defaultValue={editingEvent?.category ?? "长风沙龙"} id="event-category" name="category">
              {eventCategories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </div>

          <div className="event-manager-field">
            <label htmlFor="event-mode">举办形式</label>
            <select defaultValue={editingEvent?.mode ?? "线下"} id="event-mode" name="mode">
              {eventModes.map((mode) => <option key={mode}>{mode}</option>)}
            </select>
          </div>

          <div className="event-manager-field">
            <label htmlFor="event-start">开始时间</label>
            <input defaultValue={dateTimeInputValue(editingEvent?.startAt)} id="event-start" name="startAt" required type="datetime-local" />
          </div>

          <div className="event-manager-field">
            <label htmlFor="event-end">结束时间</label>
            <input defaultValue={dateTimeInputValue(editingEvent?.endAt)} id="event-end" name="endAt" required type="datetime-local" />
          </div>

          <div className="event-manager-field">
            <label htmlFor="event-city">城市</label>
            <input defaultValue={editingEvent?.city} id="event-city" name="city" placeholder="例如：北京" />
          </div>

          <div className="event-manager-field">
            <label htmlFor="event-venue">地点／线上平台</label>
            <input defaultValue={editingEvent?.venue} id="event-venue" name="venue" required />
          </div>

          <div className="event-manager-field event-manager-field-wide">
            <label htmlFor="event-address">详细地址（选填）</label>
            <input defaultValue={editingEvent?.address} id="event-address" name="address" />
          </div>

          <div className="event-manager-field event-manager-field-wide">
            <label htmlFor="event-summary">一句话简介</label>
            <textarea defaultValue={editingEvent?.summary} id="event-summary" name="summary" required rows={2} />
          </div>

          <div className="event-manager-field event-manager-field-wide">
            <label htmlFor="event-description">活动简介</label>
            <textarea defaultValue={editingEvent?.description.join("\n")} id="event-description" name="description" placeholder="不同段落请换行" required rows={5} />
          </div>

          <div className="event-manager-field">
            <label htmlFor="event-price-type">收费方式</label>
            <select defaultValue={editingEvent?.priceType ?? "free"} id="event-price-type" name="priceType">
              <option value="free">免费</option>
              <option value="paid">付费</option>
              <option value="invitation">邀请制</option>
            </select>
          </div>

          <div className="event-manager-field">
            <label htmlFor="event-price">价格（元）</label>
            <input defaultValue={editingEvent?.priceCny} id="event-price" min="0" name="priceCny" type="number" />
          </div>

          <div className="event-manager-field">
            <label htmlFor="event-capacity">人数限制</label>
            <input defaultValue={editingEvent?.capacity} id="event-capacity" min="1" name="capacity" required type="number" />
          </div>

          <div className="event-manager-field event-manager-field-wide">
            <span className="event-manager-field-label">活动海报</span>
            <div className="event-manager-poster-editor">
              <div className="event-manager-poster-preview">
                {posterPreview ? (
                  <img alt="当前活动海报预览" src={posterPreview} />
                ) : (
                  <span>尚未设置海报</span>
                )}
              </div>
              <div className="event-manager-poster-controls">
                <label htmlFor="event-cover-upload">上传／更换海报</label>
                <input
                  accept="image/png,image/jpeg,image/webp"
                  id="event-cover-upload"
                  name="coverUpload"
                  onChange={(event) => previewPoster(event.currentTarget.files?.[0])}
                  type="file"
                />
                <span className="event-manager-poster-or">或者填写海报地址</span>
                <input
                  defaultValue={editingEvent?.cover.startsWith("data:") ? "" : editingEvent?.cover}
                  id="event-cover"
                  name="cover"
                  onChange={(event) => {
                    const value = event.currentTarget.value.trim();
                    setPosterPreview(value || editingEvent?.cover || null);
                  }}
                  placeholder="例如：/assets/event-poster.jpg"
                />
                <small>
                  支持 PNG、JPG 或 WebP，原文件请控制在 5 MB 以内；上传后会自动等比例压缩并存入云端。
                  {editingEvent?.cover ? " 不重新上传或填写新地址，将保留当前海报。" : ""}
                </small>
              </div>
            </div>
          </div>

          <div className="event-manager-field event-manager-field-wide">
            <label htmlFor="event-registration-url">报名链接（选填）</label>
            <input defaultValue={editingEvent?.registrationUrl} id="event-registration-url" name="registrationUrl" placeholder="金数据、腾讯问卷或其他报名页面链接" type="url" />
          </div>

          <div className="event-manager-field event-manager-field-wide">
            <label htmlFor="event-registration-qr">报名二维码（选填）</label>
            <input accept="image/png,image/jpeg,image/webp" id="event-registration-qr" name="registrationQrCode" type="file" />
            <small>
              没有报名入口时可以留空；支持 PNG、JPG 或 WebP，图片请控制在 1.5 MB 以内。
              {editingEvent?.registrationQrCode ? " 已有二维码，不重新上传将保留原图。" : ""}
            </small>
          </div>

          <div className="event-manager-actions event-manager-field-wide">
            <button
              className="button button-primary"
              disabled={migrationPending || isLoading}
              type="submit"
            >
              {editingEvent ? "保存修改" : "保存并加入日历"}
            </button>
            {formError ? <p role="alert">{formError}</p> : null}
            {saved ? <span>活动信息已保存到本地管理环境。</span> : null}
          </div>
        </form>
      </section>
    </div>
  );
}
