import React from 'react';
import { motion } from 'framer-motion';

const PasswordStrength = ({ password }) => {
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, text: '', color: '' };
    
    let score = 0;
    let feedback = [];
    
    // Length check
    if (password.length >= 8) score += 1;
    else feedback.push('At least 8 characters');
    
    // Uppercase check
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('One uppercase letter');
    
    // Lowercase check
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('One lowercase letter');
    
    // Number check
    if (/\d/.test(password)) score += 1;
    else feedback.push('One number');
    
    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push('One special character');
    
    const strengthLevels = [
      { text: 'Very Weak', color: 'bg-red-500', textColor: 'text-red-600' },
      { text: 'Weak', color: 'bg-red-400', textColor: 'text-red-500' },
      { text: 'Fair', color: 'bg-yellow-400', textColor: 'text-yellow-600' },
      { text: 'Good', color: 'bg-blue-400', textColor: 'text-blue-600' },
      { text: 'Strong', color: 'bg-green-400', textColor: 'text-green-600' },
      { text: 'Very Strong', color: 'bg-green-500', textColor: 'text-green-700' }
    ];
    
    const level = Math.min(score, 5);
    
    return {
      score,
      level,
      text: strengthLevels[level].text,
      color: strengthLevels[level].color,
      textColor: strengthLevels[level].textColor,
      feedback: feedback.slice(0, 3) // Show only first 3 suggestions
    };
  };

  const strength = getPasswordStrength(password);
  
  if (!password) return null;

  return (
    <div className="mt-2">
      {/* Strength bar */}
      <div className="flex space-x-1 mb-2">
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: index <= strength.level ? 1 : 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`h-2 flex-1 rounded-full ${
              index <= strength.level ? strength.color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      
      {/* Strength text */}
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${strength.textColor}`}>
          {strength.text}
        </span>
        {strength.level >= 3 && (
          <span className="text-xs text-green-600">✓ Good to go!</span>
        )}
      </div>
      
      {/* Feedback */}
      {strength.feedback.length > 0 && strength.level < 3 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-2"
        >
          <p className="text-xs text-gray-600 mb-1">To improve strength, add:</p>
          <ul className="text-xs text-gray-500 space-y-1">
            {strength.feedback.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center"
              >
                <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default PasswordStrength;