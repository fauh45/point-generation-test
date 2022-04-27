# Point Generation Test

In this little project I'm trying to make line that connects points in random way, while still looks (kinda) normal.

## How?

Well the steps used by the algoritm are

1. Get the middle point of 2 points

   This part is done with getting the middle point in a straight line from one point to another. This part is done recursively depending on the parameter.

2. Add random modifier to a point

   For each of the point except for the origin and the destination, the point are added with random amount of modifier. The radius where the point can be on can be changed using the random radius parameter.

3. The resulting line is smoothed

   Smoothing of the line is done using Chaikin's smoothing algorithm. The implemenation used are from [chaikin-smooth in github](https://github.com/Jam3/chaikin-smooth)

## Problem

1. Hangs on lots of recursion

   Could be happening because too many points, because the smoothing algoritm do make more points as well

2. Sometimes not that normal

   As the line are just randomised line, the problem is the line could go everywhere the random modifier said it should go
