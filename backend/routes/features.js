const express = require('express');
const router = express.Router();

// GET /api/features
router.get('/', (req, res) => {
  try {
    // In a real app, this would come from a database
    const features = [
      {
        id: 1,
        title: 'AI Content Generation',
        description: 'Create high-quality content with our advanced AI models',
        icon: 'content-icon.svg'
      },
      {
        id: 2,
        title: 'Smart Analysis',
        description: 'Analyze data and extract insights automatically',
        icon: 'analysis-icon.svg'
      },
      {
        id: 3,
        title: 'Personalized Recommendations',
        description: 'Get tailored suggestions based on your preferences',
        icon: 'recommendation-icon.svg'
      }
    ];

    return res.status(200).json({ success: true, features });
  } catch (error) {
    console.error('Features fetch error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load features. Please try again later.'
    });
  }
});

module.exports = router;
