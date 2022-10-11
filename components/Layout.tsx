import Link from "next/link";
interface LayoutProps {
  children?: React.ReactNode;
}
export default function Layout(props: LayoutProps) {
  return (
    <div className="relative flex">
      <div className="flex justify-start h-[100vh] w-full border-4 bg-white flex-col ">
        {/* //!상단 메뉴바 */}
        <div
          title="Top"
          className="relative flex w-full h-8 bg-black justify-center items-center text-white"
        >
          <Link href="/">
            <div className="flex justify-center items-center w-[25vw]">
              홈으로
            </div>
          </Link>
          <Link href="/statistics">
            <div className="flex justify-center items-center w-[25vw]">
              전력통계
            </div>
          </Link>
          <Link href="/self">
            <div className="flex justify-center items-center w-[25vw]">
              자가진단
            </div>
          </Link>
          <Link href="/manager">
            <div className="flex justify-center items-center w-[25vw]">
              관리자페이지
            </div>
          </Link>
        </div>
        <div className="">{props.children}</div>
      </div>
    </div>
  );
}
