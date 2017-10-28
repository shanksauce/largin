#ifndef MURMURHASH3_H
#define MURMURHASH3_H

#include <stdint.h>

void murmurHash3_x86_32(const void* key, int len, uint32_t seed, void* out);
void murmurHash3_x86_128(const void* key, int len, uint32_t seed, void* out);
void murmurHash3_x64_128(const void* key, int len, uint32_t seed, void* out);

#endif
