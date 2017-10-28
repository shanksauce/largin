#include "module.h"
#include "murmur3.h"

using namespace Nan;
using v8::Local;
using v8::Object;
using v8::FunctionTemplate;

NAN_METHOD(murmur3) {
  uint8_t* buffer = nullptr;
  uint32_t size = 0;
  uint32_t bits = 32;

  if (info.Length() == 0) {
    info.GetReturnValue().Set(NewBuffer((char*) buffer, size).ToLocalChecked());
    return;
  }

  if (info.Length() == 2 && info[1]->IsNumber()) {
    bits = (uint32_t) info[1]->NumberValue();
    if (bits != 32 && bits != 128) {
      ThrowError("Must be either 32 or 128 bits");
    }
  }

  Local<Object> bufferObj = info[0]->ToObject();
  buffer = (uint8_t*) node::Buffer::Data(bufferObj);
  size = node::Buffer::Length(bufferObj);

  const int hashbytes = bits / 8;
  uint8_t* output = new uint8_t[hashbytes];
  memset(output, 0, hashbytes);

  switch (bits) {
    case 32:
      murmurHash3_x86_32(buffer, size, 0xcafebabe, output);
      break;
    case 128:
      murmurHash3_x64_128(buffer, size, 0xcafebabe, output);
      break;
  }

  info.GetReturnValue().Set(
    NewBuffer((char*) output, hashbytes).ToLocalChecked());
}

NAN_MODULE_INIT(InitAll) {
  Set(target, New("murmur3").ToLocalChecked(),
    GetFunction(New<FunctionTemplate>(murmur3)).ToLocalChecked());
}

NODE_MODULE(NativeExtension, InitAll)
