"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";

export const AnimatedSection = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={className}
  >
    {children}
  </motion.section>
);
