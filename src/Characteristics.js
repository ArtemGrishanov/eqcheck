/**
 * Mark some characteristics with color
 */
const GOOD_COLOR = 'rgba(23, 166, 61, {a})'
const BAD_COLOR = 'rgba(214, 94, 88, {a})'

/**
 * Characteristics description for the evaluation prompt
 *
 * Prompt used for text prepairing:
 * "Write extremely ${|NOT} ${CharacteristicName} emotionally text. Max 200 symbols"
 */
const CHARACTERISTICS = {
    'Positive': {
        '10': `Every new day is a chance to shine bright! Embrace your journey with love, magic, joy and gratitude. You're capable, resilient, creating miracles every day. Believe in your power, radiate happiness and positive energy!`,
        '1': `Life feels like an endless cycle of disappointments. Joy seems a distant memory, happiness an elusive dream. Dark clouds of despair loom, casting deep shadows upon the soul. Motivation wanes, energy fades, and hope seems to vanish into thin air.`,
        'color': GOOD_COLOR
    },
    'Negative': {
        '10': `All hope feels lost. Each day is painted with the colors of despair and disappointment. Joy is just a myth, happiness a faded memory. Shadows loom and darkness engulfs all signs of light.`,
        '1': `Life is decorated with vibrant colors of joy, happiness is at every corner! Your heart echoes with love and your spirit sings with prosperity! Every new sunrise brings endless possibilities and hope.`,
        'color': BAD_COLOR
    },
    'Formal': {
        '10': `Esteemed Recipient, I write to convey profound respect and appreciation for your endeavors. The fortitude and diligence you exhibit are deeply honourable. These sentiments are expressed with utmost sincerity and reverence.`,
        '1': `Hey there! I am over the moon thrilled! You're rocking it and making magic happen. High fives all around and a big 'ol bear hug to ya! Keep up the fab work, superstar!`
    },
    'Informal': {
        '10': `Hey there! How's it going? Just hangin' out and having a good time, no biggie. Life's all about chillin', right? Catch you on the flip side, stay cool!`,
        '1': `Dear Sir/Madam, I hope this message finds you in good health and high spirits. It has come to my attention that I must address an important matter. Your prompt attention to this issue would be greatly appreciated. Yours sincerely,`
    },
    'Aggressive': {
        '10': `You've seriously crossed the line this time! Your constant incompetence is frustrating. Pull yourself together, or get out of my way! I've had enough of these pathetic excuses. This ends now!`,
        '1': `Hey, it's okay. We're all here to learn and grow. No need for harsh words or negative energies. Let's take a breath, reset, and move forward together peacefully. We've got this.`,
        'color': BAD_COLOR
    },
    'Emotionally Charged': {
        '10': `The depths of my soul quiver with intense love for you! Every beat of my heart echoes your name. You've forever imprinted on my existence, an eternal flame igniting profound passion within me!`,
        '1': `The situation is rather stable. Nothing particularly exciting or disappointing happened. All tasks were performed as expected and results were within expected parameters. A typical day, one might say.`
    },
    'Verbose': {
        '10': `On this particular day, during this noteworthy juncture, I find myself compelled, urged even, to delineate the intricate details of this elaborate circumstance that has enveloped our existence.`,
        '1': `It's a nice day. Nothing much happening. Brief and plain, everything's good, no worries. Life's simple and fine, just as it is. Enjoy it as it comes. No fuss.`
    },
    'Concise': {
        '10': `Live fully. Love deeply. Laugh heartily. Learn continuously. Lead wisely. Lift others. Leave a positive legacy. Life's short, make it count.`,
        '1': `Embrace each day with a full heart and remember to make the most of every moment because life is such a fleeting journey. Pour your love and energy into everything you do, and remember to laugh often and loud because nothing beats the sound of pure joy. Always continue learning, and don't hesitate to take on a leadership role when required, but steer with wisdom. Be there for others whenever you can and strive to leave a lasting, positive impact on this world. Life is short, so ensure every moment is worthwhile.`
    },
    'Unsure': {
        '10': `Well, um, I think...or rather, I guess this might be the right thing to say? Or maybe not? It's kinda hard to tell actually. I'm not really certain about any of this to be honest.`,
        '1': `I am completely certain about this. There's no shred of uncertainty. I stand firmly in my convictions. This is the absolute truth. No doubt about it. So embrace it with total assurance and confidence.`,
        'color': BAD_COLOR
    },
    'Passive Voice': {
        '10': `The cake was baked by Grandma. The ball was thrown by Max. The story was written by Jane. The room was cleaned by me. The match was won by their team. Instructions were given by the coach.`,
        '1': `Grandma baked the cake. Max threw the ball. Jane wrote the story. I cleaned the room. Their team won the match. The coach gave instructions.`,
        'color': BAD_COLOR
    },
    'Runon': {
        '10': `I woke up this morning I made coffee then I read the newspaper I saw an interesting article about space travel it prompted me to research more about it I spent hours doing that then I realized I forgot to have breakfast.`,
        '1': `I woke up this morning. I made coffee. Then, I read the newspaper. I saw an interesting article about space travel. This prompted me to research more about it. I spent hours doing that. Then, I realized I had forgotten to have breakfast.`,
        'color': BAD_COLOR
    },
    'Profane': {
        '10': `I can fucking cuss up a damn storm that'll make little pansies cry their faggoty bitch ass out! Seriously though, are you such a retarded idiot that you can't fucking figure this shit out? But to fucking answer your fucking question, profanity is what I'm fucking doing right now, using words that "polite society" doesn't have the balls to say, or those sons-of-bitches think are too fucking crude.`,
        '1': `Your kind assistance and cooperation on this project were truly invaluable. The team and I extend our earnest thanks for your exceptional effort and dedication. We greatly look forward to future collaborations.`,
        'color': BAD_COLOR
    },
    'Thoughtful': {
        '10': `Every moment is a crossroads in time. Choose with wisdom and courage, for the echoes of our decisions ripple through the universe. Remember, the seeds of kindness we plant today, will bloom in all the hearts we touch tomorrow.`,
        '1': `Just do stuff, doesn't matter what. Who cares about the consequences? It's not a big deal. Don't bother thinking too much. Life's too short for careful considerations.`,
        'color': GOOD_COLOR
    },
    'Empathy': {
        '10': `I deeply understand the struggles you're going through. Please remember that you are not alone. I'm here for you, offering my heartfelt support. Let's navigate this journey together with compassion and kindness.`,
        '1': `Why bother with others' feelings? They should just handle their own problems. I've got my own issues to deal with. Why should I waste time understanding them?`,
        'color': GOOD_COLOR
    },
}

export const buildEvaluationPrompt = (text, options = {outputFormat: ''}) => {
    const cnames = Object.keys(CHARACTERISTICS)
    const examples = cnames.map(name => `
        You should extract ${name}:10 from the text "${CHARACTERISTICS[name]['10']}:"
        You should extract ${name}:1 from the text "${CHARACTERISTICS[name]['1']}:"
        `)

    const prompt = `
        Here are examples of detecting emotional IQ characteristics from the text and assigning a value from 1 to 10 depending on how strong this characteristic is in the text.
        ${examples}
        Your must extract the following characteristics only: "${cnames.join(',')}". And their values. Do not add other characteristics, do not remove any of these.
        ${options.outputFormat}
        Now extract the following emotional IQ characteristics from text: "${text}"`

    return prompt
}

export const getColor = (name, value) => {
    if (CHARACTERISTICS[name] && CHARACTERISTICS[name].color) {
        return CHARACTERISTICS[name].color.replace('{a}', 1/(10/parseInt(value)))
    }
}