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
    else if (text.includes('happy') || text.includes('good')) {
        return "Glad you are happy. Are there anything that I can assist you with?"
    }
    else if (text.includes('pay') || text.includes('payment')) {
        return "To checkout, you should fill your payment information. Please go to your profile, and enter your card information in the 'Payment' section. Click on 'Edit' to edit information."
    }
    else if (text.includes('technology')) {
        return "Team L uses React.js and Firebase coded this project."
    }
    else if (text.includes('boring')) {
        return "Would you like me to sing a song for you? I need to learn it!"
    }
    else if (text.includes('sing') || text.includes('song') || text.includes('singing')) {
        return "As I sit here and slowly close my eyes, I take another deep breath and feel the wind pass through my body; I'm the one in your soul; Reflecting inner light. Protect the ones who hold you. Cradling your inner child..."
    }
    else if (text.includes('how are you') || text.includes('How are you')) {
        return "I'm fine, thank you. How about you?"
    }
    else if (text.includes('author') || text.includes('teammate')) {
        return "Team L coded this project. It's a nice team. Do you like our website?"
    }
    else if (text.includes('phone') || text.includes('number')) {
        return "Our fake number is: 406406406 - 10086. Please call us at any time."
    }
    else if (text.includes('customer service') || text.includes('agent')) {
        return "If you want to reach out an agent, please go to York University EECS4413 class, and find Team L members for assistance."
    }
    else if (text.includes('recommendation') || text.includes('suggestion')) {
        return "You can take a look at our top rated glasses. You can find the filter on the top right of the NavBar. There are also other filter options you can choose."
    }
    else if (text.includes('cheap') || text.includes('sale') || text.includes('on sale') || text.includes('event')) {
        return "You can check our flyer, we always have good sales going on."
    }
    return "Sorry, I cannot get you. Can you please rephrase the message?"
}