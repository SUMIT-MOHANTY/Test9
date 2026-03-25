# GenAI Landing Page Deployment Guide

This document outlines the steps to deploy the GenAI landing page to production.

## Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- Access to the production server or cloud environment
- Required environment variables

## Pre-deployment Checklist

- [ ] Run the validation script: `node validate-final.js`
- [ ] Ensure all tests are passing
- [ ] Review Lighthouse performance scores
- [ ] Verify accessibility compliance
- [ ] Test on all required browsers and devices
- [ ] Ensure error handling works for all edge cases

## Environment Variables

Create a `.env` file in both frontend and backend directories with the following variables:

**Backend**:
