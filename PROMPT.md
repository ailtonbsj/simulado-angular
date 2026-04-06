Generate a modern Angular App. Follow the requisites:

# General requisites:

- All application needs to work on frontend using Angular 19 or superior.
- Always use beautiful fonts for web like Roboto, Helvetica, etc. Do not use fonts that diverge from Material UI Design.
- By default the application will use brazilian portuguese language.
- The application needs to be option to enable and disable dark mode.
- Use a responsive layout to work on both desktop and mobile.
- The app will have the following pages:

## Settings page

- This page will have a button to enable/disable the dark mode.
- Those configurations will be applied in all pages of the application.

## Practice questions page

- It must have a view to import a JSON file from the computer or to enter an external URL or must have a select with 2 examples of JSON embeded.
- It must have a button to load the JSON from this 3 type of importation. This button will start the practice.
- You also need an input field to enter the name of the student who will be taking the practice test.
- Each item in the JSON file is a question with multiple answer choices. Use the sample JSON at the end of this description.
- The question and answer choices may contain text and images encoded in base64.
- Only one question will appear on the screen at a time, but there will be an option to advance and go back through the questions.
- The answers need to appear in random order to avoid other students have the answers order.
- The options will appear on the screen with a radio UI when there is only one correct option.
- The options will appear on the screen with a checkbox UI when there are multiple correct answers.
- Use modern UI with buttons, radios and checkboxes.
- There will be a "view answer" button on the screen to verify if the user has selected the correct options.
- When the "view answer" button is clicked, a "next" button will be enabled, allowing the user to see the next question. However, the student can go back to view the previous questions.
- There should be a progress bar that goes from 0 to the last question, showing how close you are to finishing the practice test.
- Once all the questions in the JSON file are complete, the total number of correct and incorrect answers will be displayed on the screen.
- In addition to the total number of questions, also display a graph showing the percentage of correct and incorrect answers.
- There should be a button at the end of the practice test to download all the student's answers in PNG format.

## Generator/editor to Practice question page

- This page a professor will be able create JSON files with multiples questions.
- This page will the a button to import a JSON file and load on the editor.
- The editor will have input fields for editing the question statement as well as the answers.
- Those fields need to work as a WYSIWYG editor with options to add tags such bold. italic, etc.
- The fields will be able to add image that will be saved in JSON as base64.
- The image inserted into the WYSIWYG editor can have its width specified in pixels or be resized within the editor itself.
- There should be a button to add new questions.
- There should be a button to save the final JSON file to the computer.

# Sample of JSON:

```json
[
    {
        "type": "multiple",
        "question": "Isso é um exemplo de multipla escolha com imagem <img src=\"data:image/png;base64,base64code...\">.",
        "correct_answer": [
            "Resposta correta"
        ],
        "incorrect_answers": [
            "Resposta incorreta",
            "Outra resposta incorreta",
            "Não é essa resposta"
        ]
    },
    {
        "type": "boolean",
        "question": "Isso é um exemplo de questão verdadeira ou falsa.",
        "correct_answer": "False",
        "incorrect_answers": [
        "True"
        ]
    }
]
```
