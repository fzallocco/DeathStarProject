#include <stdio.h>
#include <math.h>
#include <unistd.h>

const char *shades = ".:!*oe&#%@";
const int WIDTH = 40;
const int HEIGHT = 20;

void draw_death_star(double angle) {
    int i, j;
    for (i = 0; i < HEIGHT; i++) {
        for (j = 0; j < WIDTH; j++) {
            // Map screen coordinates to a circle's space
            double x = (j - WIDTH / 2.0) / (WIDTH / 2.0);
            double y = (i - HEIGHT / 2.0) / (HEIGHT / 2.0);

            // Rotate coordinates
            double x_rot = x * cos(angle) - y * sin(angle);
            double y_rot = x * sin(angle) + y * cos(angle);

            // Determine if the point is within the circle
            double dist = sqrt(x_rot * x_rot + y_rot * y_rot);
            if (dist <= 1.0) {
                // Add Death Star features
                if (x_rot > 0.6 && y_rot < 0.3 && y_rot > -0.3) {
                    putchar(' '); // Superlaser area
                } else if (y_rot > -0.05 && y_rot < 0.05) {
                    putchar('-'); // Equatorial trench
                } else {
                    // Shading based on distance
                    int shade_index = (1.0 - dist) * (sizeof(shades) - 1);
                    putchar(shades[shade_index]);
                }
            } else {
                putchar(' '); // Background
            }
        }
        putchar('\n');
    }
}

int main() {
    double angle = 0.0;

    while (1) {
        printf("\033[H\033[J"); // Clear the screen
        draw_death_star(angle);
        angle += 0.05; // Increment rotation angle
        if (angle > 2 * M_PI) {
            angle -= 2 * M_PI; // Keep angle in range
        }
        usleep(100000); // Delay for animation effect
    }

    return 0;
}
