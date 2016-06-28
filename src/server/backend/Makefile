CC=g++
DEPENDENCIES := -lpthread -ldl -lrt

CFLAGS= $(DEPENDENCIES) -Wall -Wextra -std=c++11
APP = moonlight

all: $(APP)

$(APP): main.cc pro_driver.o dmx.o
	$(CC) main.cc pro_driver.o dmx.o ./lib/libftd2xx.a -o $(APP) $(CFLAGS)

dmx.o: dmx.cc patch.o fx.o
	$(CC) dmx.cc -c -o dmx.o $(CFLAGS)

patch.o: patch.cc
	$(CC) patch.cc -c -o patch.o $(CFLAGS)

fx.o: fx.cc
	$(CC) fx.cc -c -o fx.o $(CFLAGS)

pro_driver.o: pro_driver.cc
	$(CC) pro_driver.cc -c -o pro_driver.o $(CFLAGS)

clean:
	rm -f *.o ; rm $(APP)
