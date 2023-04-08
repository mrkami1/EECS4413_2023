import moment from "moment"


export const analyze = (text) => {
    if (text.includes('hi') || text.includes('hai') || text.includes('hello')) {
        return "Hi, How can I help you?"
    }
    else if (text.includes('date')) {
        return moment().format('MMMM Do YYYY')
    }
    else if (text.includes('time')) {
        return moment().format('h:mm:ss a')
    }
    else if (text.includes('google link')) {
        return "https://www.google.com"
    }
    else if (text.includes('interest')) {
        return "We get lots of nice glasses that you may be interested in."
    }
    else if (text.includes('thank you')) {
        return "Thanks for Contacting me"
    }
    else if (text.includes('bye')) {
        return "Have a great day, byebye!"
    }
    else if (text.includes('sad')) {
        return "Don't be sad, buy a pair of bright glasses makes you happy!"
    }
    else if (text.includes('joke')) {
        return "You wanna hear a joke? Here's a good one: Why do birds fly south in the winter? It is faster than walking!"
    }
    else if (text.includes('happy')) {
        return "Glad you are happy. Are there anything that I can assist you with?"
    }
    return "Sorry, I cannot get you. Can you please rephrase the message?"
}