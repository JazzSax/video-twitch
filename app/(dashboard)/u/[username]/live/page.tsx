import { WebcamStudio } from "./_components/WebcamStudio";

export default function LivePage() {
  return (
  <div className='p-6'>
    <div className="mb-4">
      <h1 className="text-2xl font-bold">Go Live</h1>
      <p className="text-sm text-muted-foreground">
        Stream straight from your camera and microphone — no OBS needed.
      </p>
    </div>
    <WebcamStudio/>
  </div>);
}
