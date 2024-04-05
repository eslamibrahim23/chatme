import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import moment from "moment";

function IsReceiver({ msg, receiver }) {
  return (
    <>
      <div className="flex justify-normal space-x-2 p-5 m-auto">
        <Avatar>
          <AvatarImage src={receiver.Image} />
          <AvatarFallback>
            {receiver.userName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Card className=" p-2">
          <h4 className=" font-thin text-sm mb-1 font-Comfortaa">
            {receiver.userName}
          </h4>
          <p className="text-xl break-words w-[150px] ">
            {msg.content ? msg.content : "loading"}
          </p>
          <div className="flex items-center pt-2">
            <span className="text-xs text-muted-foreground">
              {moment(msg.createdAt).calendar()}
            </span>
          </div>
        </Card>
      </div>
    </>
  );
}

export default IsReceiver;
