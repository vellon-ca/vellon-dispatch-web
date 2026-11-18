import { notFound } from "next/navigation";
import Portal from "@/components/corporate/Portal";

/* corporate.vellon.ca/<slug>: a taxi company's business account application
   link (mgcj-app .claude/notes/business-portal-design.md). Whether the company
   exists and takes applications is read in the browser
   (ba_company_application_page); a malformed slug is a plain 404 here. */
type Props = { params: Promise<{ slug: string }> };

export default async function CompanyApplyPage({ params }: Props) {
  const { slug } = await params;
  if (!/^[a-z0-9][a-z0-9-]{0,62}$/.test(slug)) notFound();
  return <Portal applySlug={slug} />;
}
