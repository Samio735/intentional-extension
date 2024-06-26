import OpenAI from "openai"

import { Storage } from "@plasmohq/storage"

export {}

const storage = new Storage()

const openai = new OpenAI({
  apiKey: process.env.PLASMO_PUBLIC_OPEN_AI_API,
  dangerouslyAllowBrowser: true
})
let info

async function askGPT(info, todos) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a system that determines if a user is browsing websites that are relevant to his to do list or not"
      },
      {
        role: "user",
        content: `The user is accessing a website that has the following content :\n ${JSON.stringify(info)} \nhis to do list contains the following tasks :\n ${
          todos?.map((todo) => todo.text).join("\n") || "No to-do list found"
        } \nis this website relevant to any items in his to-do list ? if so precise which one. Respond with a json object like this {"relevant" : boolean,\n"to-do item" : text }`
      }
    ],
    model: "gpt-3.5-turbo"
  })

  console.log(completion.choices[0]?.message?.content)
  return completion.choices[0]?.message?.content
}

info = {
  url: document.URL,
  title: document.title,
  heading: document.querySelector("h1")?.textContent,
  subheadings: Array.from(document.querySelectorAll("h2")).map(
    (subheading) => ({
      heading: subheading.textContent,
      paragraph: subheading.nextElementSibling?.textContent
    })
  )
}

// storage.get("todos").then((todos) => {
//   console.log(todos)
//   askGPT(info, todos).then((response) => {
//     if (response) {
//       const { relevant, "to-do item": todo } = JSON.parse(response)
//       if (relevant) {
//         alert(`This page is relevant to the following to-do item : ${todo}`)
//       } else {
//         alert("This page is not relevant to any of your to-do items")
//       }
//     }
//   })
// })
