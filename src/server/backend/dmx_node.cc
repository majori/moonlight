#include <node.h>
#include <vector>
#include <string>

#include "dmx.h"

namespace Wrapper {

using namespace v8;

Moonlight::DMX dmx = Moonlight::DMX();

void patchHead(const FunctionCallbackInfo<Value>&);
void updateHead(const FunctionCallbackInfo<Value>&);
void outputStatus(const FunctionCallbackInfo<Value>&);

void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "patch_head", patchHead);
  NODE_SET_METHOD(exports, "update_head", updateHead);
  NODE_SET_METHOD(exports, "status", outputStatus);
}

void patchHead(const FunctionCallbackInfo<Value>& args)
{
    Isolate* isolate = args.GetIsolate();

    unsigned int start_channel;
    std::vector<std::string> channels;

    Handle<Object> argsObj = Handle<Object>::Cast(args[0]);

    // Parse start channel
    Handle<Value> parsed_start_channel = argsObj->Get(String::NewFromUtf8(isolate, "start_channel"));
    start_channel = parsed_start_channel->NumberValue();

    // Parse channels
    Handle<Array> parsed_channels = Handle<Array>::Cast(argsObj->Get(String::NewFromUtf8(isolate,"channels")));
    int channel_count = parsed_channels->Length();
    for (int i{0};i<channel_count;i++)
    {
        String::Utf8Value utfValue(parsed_channels->Get(i));
        channels.push_back(std::string(*utfValue));
    }

    // Patch head
    int headID = dmx.patchHead(channels, start_channel);

    args.GetReturnValue().Set(Integer::New(isolate, headID));
}

void updateHead(const FunctionCallbackInfo<Value>& args)
{
    Isolate* isolate = args.GetIsolate();
    Handle<Object> argsObj = Handle<Object>::Cast(args[0]);

    String::Utf8Value utfValue(argsObj->Get(String::NewFromUtf8(isolate, "channel_name")));

    int id = argsObj->Get(String::NewFromUtf8(isolate, "id"))->NumberValue();
    std::string channel_name = std::string(*utfValue);
    uint8_t value = argsObj->Get(String::NewFromUtf8(isolate, "value"))->NumberValue();

    dmx.updateHead(id, channel_name, value);

    args.GetReturnValue().Set(Integer::New(isolate, 1));
}

void outputStatus(const FunctionCallbackInfo<Value>& args)
{
    Isolate* isolate = args.GetIsolate();

    bool status = dmx.outputStatus();
    args.GetReturnValue().Set(Boolean::New(isolate, status));
}

NODE_MODULE(dmx_addon, init)

}  // namespace wrapper
