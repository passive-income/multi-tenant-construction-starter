import StyledSheetWrapper from "@/components/StyledSheetWrapper";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Keep layout server-rendered; mount styled-components manager client-side via wrapper
  return <StyledSheetWrapper>{children}</StyledSheetWrapper>;
}
