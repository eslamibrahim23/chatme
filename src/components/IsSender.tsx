import { Card } from "./ui/card";
import moment from "moment";

function IsSender({ msg, sender }) {
  return (
    <>
      <div className="p-5">
        <div className="flex space-x-2 p-auto m-auto flex-row-reverse">
          <Card className="space-y-1 p-4">
            <p className="text-xl break-words w-[100px]">
              {msg.content ? msg.content : "loading"}
            </p>
            <div className="flex items-center pt-2">
              <span className="text-xs text-muted-foreground">
                {moment(msg.createdAt).calendar()}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export default IsSender;
