import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqItems = [
    {
        question: "How was the list of CPP majors compiled?",
        answer: "It was scraped from here: https://www.cpp.edu/programs/index.shtml?programType=Bachelor."
    },
    {
        question: "Does this include all academic major degrees?",
        answer: "At the moment, we are focusing on undergraduate programs only, so only CPP bachelor's degrees are included."
    },
    {
        question: "Where was the CPP major average GPA data sourced from?",
        answer: "Through the California Public Records Act (Government Code § 7920 et seq.), it provides the public with the right to inspect and obtain copies of public documents maintained by the CPP University."
    },
    {
        question: "What academic years does the averga GPA data cover?",
        answer: "The average GPA data spans from the academic years 2018-2019 to 2024-2025."
    },
    {
        question: "Why can't find the major I'm looking for?",
        answer: "The major may have been discontinued or it is not an undergraduate program."
    },
]

const Faq = () => {
  return (
    <section>
        <div className="mx-auto max-w-7xl  px-6 py-20  lg:px-8 text-primary">
            <h1 className="mb-4 text-3xl font-semibold md:mb-11 md:text-4xl">
                Frequently Asked Questions
            </h1>
            <Accordion type="single" collapsible>
                {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index + 1}`}>
                    <AccordionTrigger className='lg:text-xl text-lg font-medium cursor-pointer hover:no-underline'>{item.question}</AccordionTrigger>
                    <AccordionContent className='text-black text-base'>{item.answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    </section>
  )
}

export default Faq