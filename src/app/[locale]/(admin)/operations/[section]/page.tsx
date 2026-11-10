import OperationsFrame, { OperationsLinks, ReviewNotice } from "@/components/talabot/unified-review";
import {sections,type Section} from "@/components/talabot/unified-review/copy";
import {notFound} from "next/navigation";
export default async function Page({params}:{params:Promise<{section:string}>}){const {section}=await params;if(!(section in sections))notFound();return <div className="space-y-6"><ReviewNotice/><OperationsLinks/><OperationsFrame section={section as Section}/></div>}
