// Array of business data in JSON format
const businessesData = [
    {
        id: '1',
        name: 'Spice Garden',
        title: 'Authentic Indian Restaurant | Fine Dining',
        company: 'Spice Garden Restaurants Pvt Ltd',
        experience: 'Established 2018',
        location: 'Koregaon Park, Pune',
        rating: 4.8,
        reviewCount: 156,
        avatar: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        connections: 8,
        bio: 'Spice Garden is a premier dining destination offering authentic Indian cuisine in the heart of Pune. Our restaurant has been serving delicious, traditional recipes with a modern twist since 2018. Our team of experienced chefs brings together flavors from across India, using only the freshest ingredients and finest spices to create an unforgettable dining experience.',
        skills: ['North Indian', 'South Indian', 'Fine Dining', 'Catering', 'Private Events', 'Vegetarian Options'],
        contact: {
            phone: '+919876543210',
            whatsapp: '+919876543210',
            email: 'info@spicegarden.com'
        },
        business_info: {
            address: 'Spice Garden, Koregaon Park, Pune, Maharashtra 411001',
            phone: '+91 98765 43210',
            email: 'info@spicegarden.com',
            website: 'https://spicegarden.com',
            hours: 'Monday - Sunday: 11:00 AM - 11:00 PM\nKitchen closes at 10:00 PM',
            founded: '2018',
            team_size: '10-20 employees',
            industry: 'Fine Dining, Vegetarian Cuisine'
        },
        experience_items: [
            {
                title: 'Chef',
                company: 'Spice Garden',
                duration: 'May 2018 - Present',
                description: 'Led culinary team in creating a diverse menu that includes traditional Indian dishes with a modern twist. Developed recipes that have received positive feedback from customers.'
            },
            {
                title: 'Pastry Chef',
                company: 'The Bombay Canteen',
                duration: 'Jan 2016 - Apr 2018',
                description: 'Developed and executed pastry menus for special events, including wedding cakes and custom desserts. Trained junior pastry chefs and maintained kitchen standards.'
            },
            {
                title: 'Sous Chef',
                company: 'The Olive Bar & Kitchen',
                duration: 'Jun 2014 - Dec 2015',
                description: 'Managed kitchen operations, including inventory management and staff training. Developed new dishes and maintained high standards of food quality.'
            }
        ],
        services: [
            {
                id: 'service-1-1',
                title: 'Private Dining',
                description: 'Exclusive dining spaces for special occasions, business meetings, or intimate gatherings. Customized menus available.',
                price: 'Starting from ₹10,000',
                icon: 'utensils'
            },
            {
                id: 'service-1-2',
                title: 'Catering Services',
                description: 'Full-service catering for events of all sizes. We bring our signature dishes and professional service to your venue.',
                price: 'Starting from ₹800 per person',
                icon: 'bicycle'
            },
            {
                id: 'service-1-3',
                title: 'Cooking Classes',
                description: 'Learn the secrets of Indian cuisine from our master chefs. Classes available for all skill levels.',
                price: '₹2,500 per session',
                icon: 'book'
            },
            {
                id: 'service-1-4',
                title: 'Tasting Experiences',
                description: 'Experience a curated tasting menu showcasing our signature dishes and rare ingredients.',
                price: 'Starting from ₹1,500 per person',
                icon: 'coffee'
            }
        ],
        gallery: [
            {
                image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                caption: 'Our signature butter chicken dish'
            },
            {
                image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                caption: 'Restaurant interior'
            },
            {
                image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                caption: 'Private dining area'
            },
            {
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                caption: 'Freshly baked naan bread'
            },
            {
                image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                caption: 'Dessert platter'
            },
            {
                image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                caption: 'Chef in action'
            }
        ],
        reviews: [
            {
                name: 'Rahul Sharma',
                avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
                date: 'March 15, 2023',
                rating: 5,
                content: 'Absolutely amazing food and service! The butter chicken was the best I\'ve ever had, and the ambiance was perfect for our anniversary dinner. Will definitely be coming back soon.',
                photos: ['https://images.unsplash.com/photo-1567188040759-fb8a883dc6d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80']
            },
            {
                name: 'Priya Patel',
                avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
                date: 'February 8, 2023',
                rating: 4,
                content: 'Great food and nice atmosphere. The paneer tikka masala was delicious, and the naan was perfectly cooked. Service was a bit slow during peak hours, but the staff was very friendly and accommodating.',
                photos: []
            },
            {
                name: 'Vikram Malhotra',
                avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
                date: 'January 20, 2023',
                rating: 4.5,
                content: 'Excellent vegetarian options! As someone who doesn\'t eat meat, I was impressed by the variety and quality of vegetarian dishes. The dal makhani and paneer butter masala were outstanding. Highly recommend for vegetarians and non-vegetarians alike.',
                photos: []
            }
        ],
        next_available: '7:30 PM Today',
        joined: 'Jan, 2018'
    },
    {
        id: '2',
        name: 'TechSolutions Inc.',
        title: 'IT Services & Consulting | Software Development',
        company: 'TechSolutions Incorporated',
        experience: 'Established 2010',
        location: 'Hinjewadi, Pune',
        rating: 4.7,
        reviewCount: 89,
        avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        connections: 15,
        bio: 'TechSolutions Inc. is a leading IT services and consulting company based in Pune. With over a decade of experience, we specialize in custom software development, web and mobile applications, cloud solutions, and IT consulting services. Our team of skilled professionals is dedicated to delivering innovative technology solutions that help businesses grow and succeed in the digital age.',
        skills: ['Software Development', 'Web Applications', 'Mobile Apps', 'Cloud Solutions', 'IT Consulting', 'Digital Transformation'],
        contact: {
            phone: '+919876543211',
            whatsapp: '+919876543211',
            email: 'info@techsolutions.com'
        },
        business_info: {
            address: 'TechSolutions Inc., IT Park, Hinjewadi Phase 1, Pune, Maharashtra 411057',
            phone: '+91 98765 43211',
            email: 'info@techsolutions.com',
            website: 'https://techsolutions.com',
            hours: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 2:00 PM\nSunday: Closed',
            founded: '2010',
            team_size: '50-100 employees',
            industry: 'Information Technology, Software Development'
        },
        experience_items: [
            {
                title: 'CTO',
                company: 'TechSolutions Inc.',
                duration: 'Jan 2010 - Present',
                description: 'Founded and led the technical direction of the company. Built a team of skilled developers and established best practices for software development and project management.'
            },
            {
                title: 'Senior Software Architect',
                company: 'Infosys',
                duration: 'Mar 2005 - Dec 2009',
                description: 'Designed and implemented large-scale enterprise applications. Led a team of developers and mentored junior team members.'
            },
            {
                title: 'Software Developer',
                company: 'Wipro Technologies',
                duration: 'Jun 2002 - Feb 2005',
                description: 'Developed and maintained software applications for clients in the finance and healthcare sectors. Collaborated with cross-functional teams to deliver high-quality solutions.'
            }
        ],
        services: [
            {
                id: 'service-2-1',
                title: 'Custom Software Development',
                description: 'Tailored software solutions designed to meet your specific business needs and challenges.',
                price: 'Starting from ₹5,00,000',
                icon: 'laptop-code'
            },
            {
                id: 'service-2-2',
                title: 'Web Application Development',
                description: 'Responsive, user-friendly web applications built with the latest technologies and frameworks.',
                price: 'Starting from ₹3,00,000',
                icon: 'globe'
            },
            {
                id: 'service-2-3',
                title: 'Mobile App Development',
                description: 'Native and cross-platform mobile applications for iOS and Android devices.',
                price: 'Starting from ₹4,00,000',
                icon: 'mobile-alt'
            },
            {
                id: 'service-2-4',
                title: 'Cloud Solutions',
                description: 'Secure, scalable cloud infrastructure and migration services for businesses of all sizes.',
                price: 'Starting from ₹2,00,000',
                icon: 'cloud'
            },
            {
                id: 'service-2-5',
                title: 'IT Consulting',
                description: 'Strategic technology consulting to help you make informed decisions and optimize your IT investments.',
                price: '₹10,000 per day',
                icon: 'comments'
            }
        ],
        gallery: [
            {
                image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                caption: 'Our modern office building'
            },
            {
                image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                caption: 'Team meeting in progress'
            },
            {
                image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                caption: 'Collaborative workspace'
            },
            {
                image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                caption: 'Developers at work'
            },
            {
                image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                caption: 'Office lounge area'
            },
            {
                image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                caption: 'Client meeting room'
            }
        ],
        reviews: [
            {
                name: 'Amit Desai',
                avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
                date: 'April 10, 2023',
                rating: 5,
                content: 'TechSolutions developed a custom CRM for our business that has significantly improved our customer management processes. Their team was professional, responsive, and delivered the project on time and within budget. Highly recommended!',
                photos: []
            },
            {
                name: 'Sneha Joshi',
                avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                date: 'March 22, 2023',
                rating: 4,
                content: 'We hired TechSolutions for a mobile app development project. The app turned out great and our users love it. The only reason for 4 stars instead of 5 is that there were some delays in the project timeline, though they were transparent about the challenges they faced.',
                photos: []
            },
            {
                name: 'Rajiv Mehta',
                avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
                date: 'February 15, 2023',
                rating: 5,
                content: 'Excellent IT consulting services! TechSolutions helped us modernize our legacy systems and migrate to the cloud. Their expertise and guidance throughout the process was invaluable. We\'ve seen significant improvements in performance and reduced operational costs.',
                photos: []
            }
        ],
        next_available: '10:00 AM Tomorrow',
        joined: 'Mar, 2010'
    },
    {
        id: '3',
        name: 'GreenScape Architects',
        title: 'Landscape Design | Sustainable Architecture',
        company: 'GreenScape Architects & Planners',
        experience: 'Established 2015',
        location: 'Aundh, Pune',
        rating: 4.9,
        reviewCount: 67,
        avatar: 'https://images.unsplash.com/photo-1518156677180-95a2893f3499?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        connections: 12,
        bio: 'GreenScape Architects is a premier landscape design and sustainable architecture firm based in Pune. We specialize in creating beautiful, functional, and environmentally responsible outdoor spaces for residential and commercial properties. Our team of experienced landscape architects and designers is passionate about connecting people with nature through innovative and sustainable design solutions.',
        skills: ['Landscape Design', 'Sustainable Architecture', 'Garden Planning', 'Outdoor Living Spaces', 'Commercial Landscaping', 'Eco-friendly Solutions'],
        contact: {
            phone: '+919876543212',
            whatsapp: '+919876543212',
            email: 'info@greenscape.in'
        },
        business_info: {
            address: 'GreenScape Architects, Aundh Road, Pune, Maharashtra 411007',
            phone: '+91 98765 43212',
            email: 'info@greenscape.in',
            website: 'https://greenscape.in',
            hours: 'Monday - Friday: 9:30 AM - 6:30 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed',
            founded: '2015',
            team_size: '10-20 employees',
            industry: 'Architecture, Landscape Design'
        },
        experience_items: [
            {
                title: 'Principal Landscape Architect',
                company: 'GreenScape Architects',
                duration: 'Apr 2015 - Present',
                description: 'Founded and led the design direction of the firm. Managed client relationships and oversaw all major projects from concept to completion.'
            },
            {
                title: 'Senior Landscape Designer',
                company: 'Urban Green Designs',
                duration: 'Jul 2010 - Mar 2015',
                description: 'Designed and implemented landscape plans for high-end residential and commercial properties. Collaborated with architects and contractors to ensure seamless project execution.'
            },
            {
                title: 'Landscape Architect',
                company: 'EcoSpaces',
                duration: 'Feb 2008 - Jun 2010',
                description: 'Created sustainable landscape designs for residential clients. Specialized in native plant selection and water-efficient irrigation systems.'
            }
        ],
        services: [
            {
                id: 'service-3-1',
                title: 'Residential Landscape Design',
                description: 'Custom landscape designs for homes of all sizes, from small urban gardens to large estates.',
                price: 'Starting from ₹50,000',
                icon: 'home'
            },
            {
                id: 'service-3-2',
                title: 'Commercial Landscaping',
                description: 'Professional landscape design and implementation for office complexes, retail spaces, and hospitality venues.',
                price: 'Starting from ₹2,00,000',
                icon: 'building'
            },
            {
                id: 'service-3-3',
                title: 'Sustainable Garden Planning',
                description: 'Eco-friendly garden designs featuring native plants, water conservation systems, and sustainable materials.',
                price: 'Starting from ₹75,000',
                icon: 'leaf'
            },
            {
                id: 'service-3-4',
                title: 'Outdoor Living Spaces',
                description: 'Design and creation of functional outdoor living areas including patios, decks, and outdoor kitchens.',
                price: 'Starting from ₹1,50,000',
                icon: 'umbrella-beach'
            },
            {
                id: 'service-3-5',
                title: 'Landscape Consultation',
                description: 'Expert advice on plant selection, garden maintenance, and landscape improvements.',
                price: '₹5,000 per session',
                icon: 'comments'
            }
        ],
        gallery: [
            {
                image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3499?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                caption: 'Residential garden project'
            },
            {
                image: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                caption: 'Commercial landscape design'
            },
            {
                image: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                caption: 'Sustainable garden with native plants'
            },
            {
                image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                caption: 'Outdoor living space'
            },
            {
                image: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                caption: 'Water feature installation'
            },
            {
                image: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                caption: 'Rooftop garden project'
            }
        ],
        reviews: [
            {
                name: 'Neha Kapoor',
                avatar: 'https://randomuser.me/api/portraits/women/62.jpg',
                date: 'May 5, 2023',
                rating: 5,
                content: 'GreenScape transformed our backyard into a beautiful, functional space that we use year-round. Their attention to detail and knowledge of plants suitable for our climate was impressive. The team was professional and completed the project on schedule.',
                photos: []
            },
            {
                name: 'Sanjay Reddy',
                avatar: 'https://randomuser.me/api/portraits/men/72.jpg',
                date: 'April 18, 2023',
                rating: 5,
                content: 'We hired GreenScape for our office complex landscaping project, and the results exceeded our expectations. They created a sustainable, low-maintenance landscape that has received numerous compliments from visitors and employees alike.',
                photos: []
            },
            {
                name: 'Meera Singh',
                avatar: 'https://randomuser.me/api/portraits/women/82.jpg',
                date: 'March 30, 2023',
                rating: 4.5,
                content: 'The team at GreenScape designed a beautiful native plant garden for our home that has attracted so much wildlife! They were knowledgeable about local ecosystems and helped us create a garden that requires minimal water and maintenance.',
                photos: []
            }
        ],
        next_available: '2:00 PM Tomorrow',
        joined: 'Jun, 2015'
    }
]; 