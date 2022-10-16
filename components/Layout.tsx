import Link from "next/link";
interface LayoutProps {
  children?: React.ReactNode;
}
export default function Layout(props: LayoutProps) {
  return (
    <div className="relative flex">
      <div className="flex justify-start h-[100vh] w-[100vw] border-4 bg-white flex-col">
        {/* //!상단 메뉴바 */}
        <div
          title="Top"
          className="relative flex w-full h-12 bg-black justify-between items-center text-white "
        >
          <Link href="/">
            <div className="flex justify-center items-center w-[300px]">
              홈으로
            </div>
          </Link>
          <Link href="/statistics">
            <div className="flex justify-center items-center w-[300px]">
              전력통계
            </div>
          </Link>
          <Link href="/self">
            <div className="flex justify-center items-center w-[300px]">
              자가진단
            </div>
          </Link>
          <Link href="/manager">
            <div className="flex justify-center items-center w-[300px]">
              관리자페이지
            </div>
          </Link>
        </div>
        <div className="h-[95vh]">{props.children}</div>
      </div>
    </div>
  );
}
