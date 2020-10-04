#!/usr/bin/env node

const { writeFileSync } = require("fs")
const inquirer = require("inquirer")
const fetch = require("node-fetch")
const chalk = require("chalk")

const fetcher = fileName =>
  fetch(
    `https://raw.githubusercontent.com/boxdox/configs/main/files/${fileName}`
  )
    .then(res => res.text())
    .catch(e => errorMsg(e))

console.log(chalk.green.underline.bold("configs by @boxdox"))
console.log(
  chalk.blue("some commonly used configuration files. very opinionated.")
)
console.log()

inquirer
  .prompt([
    {
      type: "checkbox",
      message: "choose configs:",
      name: "configList",
      choices: [
        {
          name: ".editorconfig",
          checked: true,
        },
        {
          name: ".prettierrc",
          checked: true,
        },
      ],
    },
    {
      type: "confirm",
      message: "using typescript?",
      name: "typescript",
      default: true,
    },
  ])
  .then(selected => {
    const { configList, typescript } = selected

    configList.forEach(config => {
      fetcher(config)
        .then(content => {
          writeFileSync(config, content, (err, _) => {
            if (err) return console.log(chalk.red(err))
          })
          console.log(chalk.blue(`wrote ${config}`))
        })
        .catch(err => console.log(chalk.red(err)))
    })

    if (typescript)
      fetcher("tsconfig.json")
        .then(content => {
          writeFileSync("tsconfig.json", content, (err, _) => {
            if (err) return console.log(chalk.red(err))
          })
          console.log(chalk.blue(`wrote tsconfig.json`))
        })
        .catch(err => console.log(chalk.red(err)))
  })
  .catch(() =>
    console.log(chalk.blue("error. open an issue on https://git.io/JUdeg"))
  )
