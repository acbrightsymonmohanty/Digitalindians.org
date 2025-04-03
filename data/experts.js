// Array of expert data in JSON format
const expertsData = [
    {
        id: '1',
        name: 'Rajesh Kumar',
        title: 'Digital Marketing Specialist | Marketer | SEO Expert',
        company: 'TechSolutions Inc.',
        experience: '5+ Years Experience',
        location: 'Pune, Maharashtra',
        rating: 4.8,
        reviewCount: 125,
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        connections: 5,
        bio: 'I am a Digital Marketing Specialist with a passion for driving engagement, nurturing customer relationships, and maximizing campaign performance. With over 5 years of experience, I\'ve helped businesses achieve their marketing goals through strategic SEO, content marketing, and paid advertising campaigns.',
        skills: ['Digital Marketing', 'SEO', 'Content Marketing', 'PPC Campaigns', 'Social Media', 'Marketing Strategy'],
        contact: {
            phone: '+919876543210',
            whatsapp: '+919876543210',
            email: 'rajesh.kumar@example.com'
        },
        experience_items: [
            {
                title: 'Digital Marketing Specialist',
                company: 'TechSolutions Inc.',
                duration: 'Jan 2021 - Present',
                description: 'Leading digital marketing initiatives across multiple channels including SEO, PPC, and social media. Developed and implemented marketing strategies that increased organic traffic by 45% and conversion rates by 28%.'
            },
            {
                title: 'SEO Specialist',
                company: 'GrowthMarketing Agency',
                duration: 'Mar 2019 - Dec 2020',
                description: 'Managed SEO strategies for over 15 clients across various industries. Conducted comprehensive SEO audits, keyword research, and competitive analysis to improve search engine rankings and visibility.'
            },
            {
                title: 'Digital Marketing Associate',
                company: 'InnovateDigital',
                duration: 'Jun 2017 - Feb 2019',
                description: 'Assisted in implementing digital marketing campaigns across multiple platforms. Managed social media accounts, created content, and analyzed campaign performance to optimize results.'
            }
        ],
        next_available: '8:00 PM - 7th Mar',
        joined: 'Jan, 2023'
    },
    {
        id: '2',
        name: 'Priya Sharma',
        title: 'Digital Marketing Manager | Content Strategist',
        company: 'MarketEdge Solutions',
        experience: '7+ Years Experience',
        location: 'Bangalore, Karnataka',
        rating: 4.9,
        reviewCount: 178,
        avatar: 'https://randomuser.me/api/portraits/women/26.jpg',
        connections: 12,
        bio: 'Experienced Digital Marketing Manager with a proven track record of developing and executing successful marketing campaigns. Skilled in content strategy, SEO optimization, and social media management. Passionate about helping businesses grow their online presence and achieve their marketing goals.',
        skills: ['Content Strategy', 'SEO', 'Social Media Marketing', 'Email Campaigns', 'Analytics', 'Team Leadership'],
        contact: {
            phone: '+919876543211',
            whatsapp: '+919876543211',
            email: 'priya.sharma@example.com'
        },
        experience_items: [
            {
                title: 'Digital Marketing Manager',
                company: 'MarketEdge Solutions',
                duration: 'Apr 2019 - Present',
                description: 'Leading a team of 5 marketing specialists to develop and implement comprehensive digital marketing strategies. Increased client conversion rates by 35% and improved ROI on marketing spend by 40%.'
            },
            {
                title: 'Content Marketing Specialist',
                company: 'WebGrowth India',
                duration: 'Jun 2016 - Mar 2019',
                description: 'Developed content strategies for B2B and B2C clients. Created and managed editorial calendars, produced high-quality content, and optimized for SEO to increase organic traffic.'
            },
            {
                title: 'Marketing Associate',
                company: 'Digital Minds',
                duration: 'Jan 2014 - May 2016',
                description: 'Assisted in content creation, social media management, and email marketing campaigns. Analyzed campaign performance and provided insights for optimization.'
            }
        ],
        next_available: '2:30 PM - 5th Mar',
        joined: 'Mar, 2022'
    },
    {
        id: '3',
        name: 'Vikram Singh',
        title: 'Social Media Manager | Digital Strategist',
        company: 'SocialBoost Media',
        experience: '4+ Years Experience',
        location: 'Delhi, NCR',
        rating: 4.7,
        reviewCount: 92,
        avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
        connections: 8,
        bio: 'Creative Social Media Manager with expertise in developing engaging content and managing social media campaigns. Skilled in audience growth, community management, and social analytics. Passionate about helping brands build meaningful connections with their audience.',
        skills: ['Social Media Strategy', 'Content Creation', 'Community Management', 'Paid Social', 'Analytics', 'Influencer Marketing'],
        contact: {
            phone: '+919876543212',
            whatsapp: '+919876543212',
            email: 'vikram.singh@example.com'
        },
        experience_items: [
            {
                title: 'Social Media Manager',
                company: 'SocialBoost Media',
                duration: 'Aug 2020 - Present',
                description: 'Managing social media presence for 10+ clients across various platforms. Developed strategies that increased engagement by 65% and follower growth by 40% year-over-year.'
            },
            {
                title: 'Digital Marketing Specialist',
                company: 'ConnectBrands',
                duration: 'May 2018 - Jul 2020',
                description: 'Managed social media accounts and digital marketing campaigns for e-commerce clients. Created content calendars, designed graphics, and analyzed performance metrics.'
            },
            {
                title: 'Social Media Coordinator',
                company: 'DigitalEdge',
                duration: 'Jan 2017 - Apr 2018',
                description: 'Assisted in social media content creation and scheduling. Monitored social channels and engaged with audience. Helped grow social following by 25%.'
            }
        ],
        next_available: '11:00 AM - 8th Mar',
        joined: 'Sep, 2021'
    },
    {
        id: '4',
        name: 'Ankit Gupta',
        title: 'SEO Specialist | Technical SEO Expert',
        company: 'RankHigher SEO',
        experience: '6+ Years Experience',
        location: 'Mumbai, Maharashtra',
        rating: 4.6,
        reviewCount: 115,
        avatar: 'https://randomuser.me/api/portraits/men/59.jpg',
        connections: 7,
        bio: 'Technical SEO specialist with extensive experience in improving search engine rankings and driving organic traffic. Expert in on-page and off-page optimization, technical audits, and keyword research. Committed to delivering measurable results for clients.',
        skills: ['Technical SEO', 'Keyword Research', 'On-Page SEO', 'Off-Page SEO', 'Local SEO', 'SEO Audits'],
        contact: {
            phone: '+919876543213',
            whatsapp: '+919876543213',
            email: 'ankit.gupta@example.com'
        },
        experience_items: [
            {
                title: 'Senior SEO Specialist',
                company: 'RankHigher SEO',
                duration: 'Nov 2019 - Present',
                description: 'Leading SEO strategies for enterprise clients. Conducted comprehensive technical audits and implemented optimization strategies that improved rankings for competitive keywords by 40%.'
            },
            {
                title: 'SEO Consultant',
                company: 'SearchWave',
                duration: 'Mar 2017 - Oct 2019',
                description: 'Provided SEO consulting services for small to medium businesses. Developed and executed SEO strategies that increased organic traffic by 75% and improved conversion rates.'
            },
            {
                title: 'Digital Marketing Analyst',
                company: 'WebMetrics',
                duration: 'Jun 2015 - Feb 2017',
                description: 'Analyzed website performance and SEO metrics. Identified optimization opportunities and implemented changes to improve search visibility and user experience.'
            }
        ],
        next_available: '4:00 PM - 6th Mar',
        joined: 'Feb, 2022'
    },
    {
        id: '5',
        name: 'Neha Patel',
        title: 'Content Marketing Lead | Copywriter',
        company: 'ContentCraft',
        experience: '5+ Years Experience',
        location: 'Hyderabad, Telangana',
        rating: 5.0,
        reviewCount: 76,
        avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
        connections: 9,
        bio: 'Creative Content Marketing Lead with a passion for storytelling and brand messaging. Experienced in developing content strategies, creating engaging copy, and managing editorial calendars. Dedicated to helping brands connect with their audience through compelling content.',
        skills: ['Content Strategy', 'Copywriting', 'Blog Management', 'SEO Writing', 'Email Marketing', 'Brand Messaging'],
        contact: {
            phone: '+919876543214',
            whatsapp: '+919876543214',
            email: 'neha.patel@example.com'
        },
        experience_items: [
            {
                title: 'Content Marketing Lead',
                company: 'ContentCraft',
                duration: 'Jul 2020 - Present',
                description: 'Leading content strategy and creation for B2B and B2C clients. Developed comprehensive content marketing plans that increased blog traffic by 120% and lead generation by 45%.'
            },
            {
                title: 'Senior Content Writer',
                company: 'WordSmith Media',
                duration: 'Sep 2018 - Jun 2020',
                description: 'Created high-quality content for websites, blogs, and marketing materials. Optimized content for SEO and user engagement. Managed a team of freelance writers.'
            },
            {
                title: 'Content Specialist',
                company: 'DigitalNarrative',
                duration: 'Mar 2016 - Aug 2018',
                description: 'Developed and executed content strategies for various clients. Created blog posts, social media content, and email newsletters that improved engagement and conversion rates.'
            }
        ],
        next_available: '1:00 PM - 9th Mar',
        joined: 'Apr, 2022'
    }
]; 