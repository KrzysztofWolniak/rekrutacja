/* eslint-disable prettier/prettier */
import React from 'react';
import { motion } from 'framer-motion';

const loadingCircle = {
  display: 'block',
  width: '1rem',
  height: '1rem',
  backgroundColor: 'black',
  borderRadius: '0.5rem',
};
const loadingContainer = {
  height: '2rem',
  display: 'flex',
  justifyContent: 'space-around',
  margin: '0',
};
const loadingContainerVariants = {
  start: {
    transition: {
      staggerChildren: 0.4,
    },
  },
  end: {
    transition: {
      staggerChildren: 1,
    },
  },
};
const loadingCircleVariants = {
  start: {
    y: '0%',
  },
  end: {
    y: '100%',
  },
};
const loadingCircleTransition = {
  duration: 0.4,
  yoyo: Infinity,
  ease: 'easeInOut',
};
const LoadingDots = () => {
  return (
    <motion.div
      style={loadingContainer}
      variants={loadingContainerVariants}
      initial="start"
      animate="end"
      className="text-center"
    >
      <motion.span
        style={loadingCircle}
        variants={loadingCircleVariants}
        transition={loadingCircleTransition}
      />
      <motion.span
        style={loadingCircle}
        variants={loadingCircleVariants}
        transition={loadingCircleTransition}
      />
      <motion.span
        style={loadingCircle}
        variants={loadingCircleVariants}
        transition={loadingCircleTransition}
      />
      <motion.span
        style={loadingCircle}
        variants={loadingCircleVariants}
        transition={loadingCircleTransition}
      />
      <motion.span
        style={loadingCircle}
        variants={loadingCircleVariants}
        transition={loadingCircleTransition}
      />
    </motion.div>
  );
};

export default LoadingDots;
