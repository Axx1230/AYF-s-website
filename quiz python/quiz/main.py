import random
import time

print(
    "Welcome to Improving your arithmetic skills.\nPlease answer the following questions.\nYou will be given a score out of 10 at the end of the quiz with a percentage based on that score.\nIf you enter your answer and it's correct, you will be moved on to the next question.\nIf you get the answer wrong, you will be given the correct answer but still move on to the next question. Good luck!"
)
print(" ")

time.sleep(3)


def generate_question(count):
  num1 = random.randint(1, 10)
  num2 = random.randint(1, 10)
  operator = random.choice(['+', '-', '*', '/'])
  if operator == '/':
    num1 = num1 * num2  # Ensure division results in whole numbers
    print(" ")
  question = f"{count+1}) What is the result of {num1} {operator} {num2}? "

  return question, eval(str(num1) + operator + str(num2))


def main():
  score = 0
  for count in range(10):
    question, answer = generate_question(count)
    while True:
      user_answer = input(question)
      try:
        user_answer = float(user_answer)
        break  # Break the loop if input is successfully converted to float
      except ValueError:
        print(" ")
        print("Please enter a valid number.")
        print(" ")
    if user_answer == answer:
      score += 1
    else:
      print(" ")
      print(f"Incorrect. The correct answer is {answer}.")
      print(" ")
  print(f"You scored {score}/10")
  percentage_score = (score / 10) * 100
  print(f"Percentage score: {percentage_score}%")
  if percentage_score >= 90:
    print("Excellent score")
  elif percentage_score <= 50:
    print("You need to practice more")
  else:
    print("terrible score")


if __name__ == "__main__":
  while True:
    main()
    print(" ")
    play_again = input("Do you want to try again? (y/n): ")
    print(" ")
    if play_again.lower() == 'n':
      break
