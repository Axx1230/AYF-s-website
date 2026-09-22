import pygame
from collections import deque

# Initialize Pygame
pygame.init()

# Screen setup
SCREEN_WIDTH, SCREEN_HEIGHT = 800, 600
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Car Movement Demo")
clock = pygame.time.Clock()

# Colors
BLUE = (0, 0, 168)
YELLOW = (168, 168, 0)
BLACK = (0, 0, 0)

# Car settings
CAR_WIDTH, CAR_HEIGHT = 100, 100
MAX_SPEED, MIN_SPEED = 20, 1
ACCELERATION = 0.5  # smooth speed change


class Car:
    """Car object with position, speed, and movement handling."""

    def __init__(self, image_path, x=0, y=0, speed=0):
        self.image = pygame.image.load(image_path)
        self.image = pygame.transform.scale(self.image, (CAR_WIDTH, CAR_HEIGHT))
        self.rect = self.image.get_rect(topleft=(x, y))
        self.speed = speed
        self.target_speed = 10

    def move(self, keys):
        """Move car with smooth acceleration and boundary checks."""
        # Smooth speed adjustment
        if keys[pygame.K_PLUS] or keys[pygame.K_EQUALS]:
            self.target_speed = min(self.target_speed + 1, MAX_SPEED)
        if keys[pygame.K_MINUS]:
            self.target_speed = max(self.target_speed - 1, MIN_SPEED)

        # Smooth speed change
        if self.speed < self.target_speed:
            self.speed = min(self.speed + ACCELERATION, self.target_speed)
        elif self.speed > self.target_speed:
            self.speed = max(self.speed - ACCELERATION, self.target_speed)

        # Movement
        if keys[pygame.K_LEFT] and self.rect.left > 0:
            self.rect.x -= self.speed
        if keys[pygame.K_RIGHT] and self.rect.right < SCREEN_WIDTH:
            self.rect.x += self.speed
        if keys[pygame.K_UP] and self.rect.top > 0:
            self.rect.y -= self.speed
        if keys[pygame.K_DOWN] and self.rect.bottom < SCREEN_HEIGHT:
            self.rect.y += self.speed

    def draw(self, surface):
        surface.blit(self.image, self.rect)


class MouseTrail:
    """Tracks the mouse trail with a fixed length."""

    def __init__(self, max_length=500):
        self.points = deque(maxlen=max_length)
        self.visible = True

    def update(self, pos):
        self.points.append(pos)

    def draw(self, surface):
        if self.visible and len(self.points) > 1:
            pygame.draw.lines(surface, BLACK, False, list(self.points))


def get_background_color(car_rect, mouse_pos):
    """Return background color depending on mouse collision with car."""
    return BLUE if car_rect.collidepoint(mouse_pos) else YELLOW


def main():
    car = Car("car.png")
    trail = MouseTrail()
    is_running = True

    while is_running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                is_running = False
            elif event.type == pygame.KEYDOWN and event.key == pygame.K_t:
                trail.visible = not trail.visible  # toggle trail

        keys = pygame.key.get_pressed()
        car.move(keys)

        # Update mouse trail
        mouse_pos = pygame.mouse.get_pos()
        trail.update(mouse_pos)

        # Draw everything
        screen.fill(get_background_color(car.rect, mouse_pos))
        trail.draw(screen)
        car.draw(screen)

        pygame.display.flip()
        clock.tick(60)

    pygame.quit()


if __name__ == "__main__":
    main()
