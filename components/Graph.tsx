import Particular from "./Particular";
import { Today } from "./Today";
interface LayoutProps {
  select: string;
}
export default function Graph({ select }: LayoutProps) {
  if (select == "상세전력통계") {
    return <Particular />;
  } else {
    return <Today select={select} />;
  }
}
