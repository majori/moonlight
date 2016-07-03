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
void getHeads(const FunctionCallbackInfo<Value>& args);
void getErrMsg(const FunctionCallbackInfo<Value>& args);

void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "patch_head", patchHead);
  NODE_SET_METHOD(exports, "update_head", updateHead);
  NODE_SET_METHOD(exports, "status", outputStatus);
  NODE_SET_METHOD(exports, "get_heads", getHeads);
  NODE_SET_METHOD(exports, "get_error_msg", getErrMsg);
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

    // Parse name
    v8::String::Utf8Value parsed_name(argsObj->Get(String::NewFromUtf8(isolate, "name")));
    std::string name = std::string(*parsed_name);

    // Patch head
    int headID = dmx.patchHead(channels, start_channel, name);

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
    args.GetReturnValue().Set(Boolean::New(isolate, dmx.outputStatus()));
}

void getHeads(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    std::map<int,Moonlight::Head*> heads = dmx.getHeads();
    Local<Array> arr = Array::New(isolate);
    size_t x{0};
    for (std::map<int,Moonlight::Head*>::iterator it{heads.begin()}; it!=heads.end();it++)
    {
        Local<Object> obj = Object::New(isolate);

        // Get ID
        obj->Set(String::NewFromUtf8(isolate, "id"),
           Integer::New(isolate, it->first)
        );

        // Get name
        obj->Set(String::NewFromUtf8(isolate, "name"),
           String::NewFromUtf8(isolate, it->second->getName().c_str())
        );

        // Get start channel
        obj->Set(String::NewFromUtf8(isolate, "start_channel"),
           Integer::New(isolate, it->second->getStartChannel()+1)
        );

        // Get channels
        Local<Array> chan_arr = Array::New(isolate);
        std::map<std::string, uint8_t> channels = it->second->getChannels();
        for (std::map<std::string, uint8_t>::iterator itY{channels.begin()}; itY!=channels.end();itY++)
        {
            chan_arr->Set(Integer::New(isolate, itY->second),
                String::NewFromUtf8(isolate, itY->first.c_str())
            );
        }
        obj->Set(String::NewFromUtf8(isolate, "channels"), chan_arr);

        arr->Set(x, obj);
        x++;
    }
    args.GetReturnValue().Set(arr);
}

void getErrMsg(const FunctionCallbackInfo<Value>& args)
{
    Isolate* isolate = args.GetIsolate();
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, dmx.getDriverErrMsg().c_str()));
}

NODE_MODULE(dmx_addon, init)

}  // namespace wrapper
