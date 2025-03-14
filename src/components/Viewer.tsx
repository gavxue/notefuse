import { Card } from "./ui/card";

type Props = {
  pdf_url: string;
};

export default function Viewer({ pdf_url }: Props) {
  return (
    <Card className="p-4 h-full">
      <iframe
        src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}
        className="w-full h-full"
      ></iframe>
    </Card>
  );
}
