type Props = {
  pdf_url: string;
};

export default function Viewer({ pdf_url }: Props) {
  return (
    <iframe
      src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}
      className="w-full h-full"
    ></iframe>
  );
}
