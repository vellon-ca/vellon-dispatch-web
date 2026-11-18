import Portal from "@/components/corporate/Portal";

/* corporate.vellon.ca/statements/<id>: the link in the statement email. The
   portal signs the manager in first, then opens it. */
type Props = { params: Promise<{ id: string }> };

export default async function StatementPage({ params }: Props) {
  const { id } = await params;
  const valid = /^[0-9a-f-]{36}$/i.test(id);
  return <Portal initialStatement={valid ? id : null} />;
}
