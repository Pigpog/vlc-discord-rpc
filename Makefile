TARGET=$(PACKAGE).$(LIB_EXTENSION)
VARS=$(wildcard $(VARDIR)/*.txt)
TMPL=$(wildcard $(TMPLDIR)/*.c)
SRCS=$(wildcard $(SRCDIR)/*.c)
OBJS=$(SRCS:.c=.o)


all: preprocess $(TARGET)

%.o: %.c
	$(CC) $(CFLAGS) $(WARNINGS) $(CPPFLAGS) -o $@ -c $<

$(TARGET): $(OBJS)
	$(CC) -o $@ $^ $(LDFLAGS) $(LIBS) -llua $(PLATFORM_LDFLAGS)

preprocess:
	lua ./codegen.lua $(VARS) $(TMPL)

install:
	mkdir -p $(LIBDIR)
	cp $(TARGET) $(LIBDIR)

