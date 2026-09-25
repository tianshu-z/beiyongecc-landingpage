type EventLocationProps = {
  city?: string;
  venue: string;
};

export default function EventLocation({ city, venue }: EventLocationProps) {
  return (
    <>
      {city ? <strong className="event-location-city">【{city}】</strong> : null}
      {venue}
    </>
  );
}
