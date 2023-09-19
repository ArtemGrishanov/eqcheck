const phrases = [
    `Hi Segah,
I want to know what this product does. Yes, I am not giving you money for it, but I still expect you to go out of your way to serve me. Yes, serve me, me, me...`,

    // extremely positive
    `Dear friend,
Every new day is a chance to shine bright! Embrace your journey with love, magic, joy and gratitude. You're capable, resilient, creating miracles every day. Believe in your power, radiate happiness and positive energy!`,

    // white aggressive boss email to his employee
    `Hi Piter,
I hope this message finds you well. I am writing to address an issue that’s impacting productivity levels and overall team performance. Your recent work has been inconsistent and filled with avoidable errors.`,

    // write formal negative product review,
    `Hi Market Team,
I regret to inform that my recent acquisition of your product did not meet my expectations. Despite the affirmative testimonies and promising advertisements, the product failed to deliver on its claims.`,

    //write verbose product feature request
    `Dear team,
I hope this correspondence finds you in good health and high spirits. I am writing to you to express my interest in seeing certain modifications and enhancements to your product. In my humble experience as a regular user, I have encountered situations wherein the addition of specific features could significantly elevate the overall experience and functionality.`,

    // write emotionally charged letter
    `My Darling,
Every word I pen is a testament to the magnitude of feelings that surge within me. My heart quakes with the intensity of emotions that you stir within me, growing stronger with each passing moment. Each breath I draw is laden with thoughts of you.`
]

export const getDefaultPhrase = () => {
    return phrases[0]
}

export const getRandomPhrase = () => {
    return phrases[Math.floor(Math.random() * phrases.length)]
}