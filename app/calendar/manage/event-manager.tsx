"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  calendarEvents,
  eventCategories,
  eventModes,
  type CalendarEvent,
} from "@/shared/calendar";
import CalendarView from "../calendar-view";
import {
  addManagedEvent,
  readManagedEvents,
  removeManagedEvent,
  updateManagedEvent,
} from "../draft-storage";

function withChinaOffset(value: string) {
  return `${value}:00+08:00`;
}

function dateTimeInputValue(value?: string) {
  return value ? value.slice(0, 16) : "";
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function EventManager() {
  const [events, setEvents] = useState<CalendarEvent[]>(calendarEvents);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setEvents(readManagedEvents());
  }, []);

  function startEditing(event: CalendarEvent) {
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

  function deleteEvent(event: CalendarEvent) {
    const confirmed = window.confirm(`确定删除“${event.title}”吗？`);
    if (!confirmed) return;

    removeManagedEvent(event.id);
    setEvents(readManagedEvents());
    if (editingEvent?.id === event.id) setEditingEvent(null);
  }

  async function previewPoster(file: File | undefined) {
    if (!file || file.size === 0) return;

    if (file.size > 3_000_000) {
      setFormError("活动海报请控制在 3 MB 以内。");
      return;
    }

    setPosterPreview(await fileToDataUrl(file));
    setFormError("");
  }

  async function submitEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const id = editingEvent?.id ?? `local-${Date.now()}`;
    const priceType = String(form.get("priceType")) as CalendarEvent["priceType"];
    const registrationUrl = String(form.get("registrationUrl"));
    const qrFile = form.get("registrationQrCode");
    const hasQrFile = qrFile instanceof File && qrFile.size > 0;
    const retainedQrCode = editingEvent?.registrationQrCode;
    const coverFile = form.get("coverUpload");
    const hasCoverFile = coverFile instanceof File && coverFile.size > 0;
    const coverUrl = String(form.get("cover")).trim();

    if (!registrationUrl && !hasQrFile && !retainedQrCode) {
      setFormError("请至少填写报名链接或上传报名二维码。");
      return;
    }

    if (hasQrFile && qrFile.size > 1_500_000) {
      setFormError("二维码图片请控制在 1.5 MB 以内。");
      return;
    }

    if (hasCoverFile && coverFile.size > 3_000_000) {
      setFormError("活动海报请控制在 3 MB 以内。");
      return;
    }

    const registrationQrCode = hasQrFile
      ? await fileToDataUrl(qrFile)
      : retainedQrCode;
    const uploadedCover = hasCoverFile ? await fileToDataUrl(coverFile) : undefined;
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
        uploadedCover ||
        coverUrl ||
        editingEvent?.cover ||
        "/assets/chinese-armillary-sphere-transparent.svg",
      priceType,
      priceCny:
        priceType === "paid" ? Number(form.get("priceCny")) || 0 : undefined,
      capacity: Number(form.get("capacity")) || undefined,
      registrationStatus: editingEvent?.registrationStatus ?? "open",
      registrationUrl: registrationUrl || undefined,
      registrationQrCode,
      demo: false,
    };

    if (editingEvent) updateManagedEvent(managedEvent);
    else addManagedEvent(managedEvent);

    setEvents(readManagedEvents());
    setEditingEvent(null);
    setPosterPreview(null);
    setSaved(true);
    setFormError("");
    formElement.reset();
  }

  return (
    <div className="event-manager">
      <section className="event-manager-calendar" aria-label="活动管理日历">
        <div className="event-manager-section-heading">
          <div>
            <p className="eyebrow">MANAGE EVENTS</p>
            <h2>选择需要操作的活动</h2>
          </div>
          <button
            className="button"
            onClick={() => {
              setEditingEvent(null);
              setPosterPreview(null);
              setSaved(false);
              setFormError("");
              document.getElementById("event-editor")?.scrollIntoView({ behavior: "smooth" });
            }}
            type="button"
          >
            新建活动
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
                  支持 PNG、JPG 或 WebP，图片请控制在 3 MB 以内。
                  {editingEvent?.cover ? " 不重新上传或填写新地址，将保留当前海报。" : ""}
                </small>
              </div>
            </div>
          </div>

          <div className="event-manager-field event-manager-field-wide">
            <label htmlFor="event-registration-url">报名链接</label>
            <input defaultValue={editingEvent?.registrationUrl} id="event-registration-url" name="registrationUrl" placeholder="金数据、腾讯问卷或其他报名页面链接" type="url" />
          </div>

          <div className="event-manager-field event-manager-field-wide">
            <label htmlFor="event-registration-qr">报名二维码</label>
            <input accept="image/png,image/jpeg,image/webp" id="event-registration-qr" name="registrationQrCode" type="file" />
            <small>
              支持 PNG、JPG 或 WebP；本地版本请控制在 1.5 MB 以内。
              {editingEvent?.registrationQrCode ? " 已有二维码，不重新上传将保留原图。" : ""}
            </small>
          </div>

          <div className="event-manager-actions event-manager-field-wide">
            <button className="button button-primary" type="submit">
              {editingEvent ? "保存修改" : "保存并加入日历"}
            </button>
            {formError ? <p role="alert">{formError}</p> : null}
            {saved ? <span>活动信息已保存。</span> : null}
          </div>
        </form>
      </section>
    </div>
  );
}
