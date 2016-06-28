CC=g++
DEPENDENCIES := -lpthread -ldl -lrt

CFLAGS= $(DEPENDENCIES) -Wall -Wextra -std=c++11
APP = moonlight

all: $(APP)

$(APP): main.cc dmx.o patch.o fx.o pro_driver.o easing.o
	$(CC) main.cc dmx.o patch.o fx.o pro_driver.o easing.o ./lib/libftd2xx.a -o $(APP) $(CFLAGS)

dmx.o: dmx.cc
	$(CC) dmx.cc -c -o dmx.o $(CFLAGS)

patch.o: patch.cc
	$(CC) patch.cc -c -o patch.o $(CFLAGS)

fx.o: fx.cc easing.o
	$(CC) fx.cc -c -o fx.o $(CFLAGS)

pro_driver.o: pro_driver.cc
	$(CC) pro_driver.cc -c -o pro_driver.o $(CFLAGS)

easing.o: ./lib/easing.c
	$(CC) ./lib/easing.c -c -o easing.o $(CFLAGS)

clean:
	rm -f *.o ; rm $(APP)
