#ifndef MOBILE_HARNESS_TALLOC_REPLACE_H
#define MOBILE_HARNESS_TALLOC_REPLACE_H

// Android/Bionic provides the portability functions used by talloc.c.
#include <errno.h>
#include <inttypes.h>
#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#define HAVE_CONSTRUCTOR_ATTRIBUTE 1
#define HAVE_GETAUXVAL 1
#define HAVE_INTPTR_T 1
#define HAVE_SYS_AUXV_H 1
#define HAVE_VA_COPY 1

/* Bionic (Android) does not provide C23's memset_explicit; use volatile
 * semantics compatible with talloc's intent to prevent the wipe from being
 * optimized out. */
#ifndef HAVE_MEMSET_EXPLICIT
#if defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L
#define HAVE_MEMSET_EXPLICIT 1
#else
static inline void *mobile_harness_memset_explicit(void *dest, int c, size_t n)
{
    volatile unsigned char *d = (volatile unsigned char *)dest;
    while (n--) {
        *d++ = (unsigned char)c;
    }
    return dest;
}
#define memset_explicit(dest, c, n) mobile_harness_memset_explicit((dest), (c), (n))
#endif
#endif

#ifndef MIN
#define MIN(a, b) ((a) < (b) ? (a) : (b))
#endif

#endif
