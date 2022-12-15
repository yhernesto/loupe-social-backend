import { Module } from "@nestjs/common";
import { FacebookApiHandlerService } from "./api-handler.service";

@Module({
    imports: [],
    providers: [FacebookApiHandlerService],
    exports: [FacebookApiHandlerService]
})
export class FacebookApiHandlerModule {}