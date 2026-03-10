"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Star, Quote, MessageSquareQuote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface TestimonialItem {
  name: string;
  role: string;
  initials: string;
  color: string;
  rating: number;
  text: string;
}

const avatarColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-pink-500",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

interface TestimonialsProps {
  testimonials?: TestimonialItem[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const hasTestimonials = testimonials && testimonials.length > 0;

  const items = hasTestimonials
    ? testimonials.map((t, i) => ({
        ...t,
        initials: t.initials || getInitials(t.name),
        color: t.color || avatarColors[i % avatarColors.length],
        rating: t.rating ?? 5,
      }))
    : [];

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-primary/70">
            Testimonials
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            What our{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              learners
            </span>{" "}
            say
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {hasTestimonials
              ? "Hear from learners who have experienced our courses first-hand."
              : "Testimonials from your learners will appear here once you add them."}
          </p>
        </motion.div>

        {hasTestimonials ? (
          /* Testimonials grid */
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.name}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20"
              >
                {/* Quote icon */}
                <div className="pointer-events-none absolute -right-2 -top-2 text-primary/[0.04]">
                  <Quote className="size-24" strokeWidth={1} />
                </div>

                {/* Subtle gradient on hover */}
                <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Stars */}
                <div className="mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Review text */}
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 border-t border-border/40 pt-4">
                  <Avatar className="size-10">
                    <AvatarFallback
                      className={`${testimonial.color} text-white text-xs font-bold`}
                    >
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty state placeholder */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto max-w-md"
          >
            <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-12 text-center">
              <MessageSquareQuote className="size-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-sm font-medium text-muted-foreground mb-1">
                No testimonials yet
              </p>
              <p className="text-xs text-muted-foreground/70">
                Your testimonials will show up here. Add them from the admin
                panel under Landing Page settings.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
