export interface Hotel {
    id: string;
    name: string;
    address: string;
    pricePerNight: number;
    currency: string;
    rating: number;
    image: string;
    amenities: string[];
}

const MOCK_HOTELS: Hotel[] = [
    {
        id: "h1",
        name: "Grand Plaza Hotel",
        address: "Downtown, City Center",
        pricePerNight: 450,
        currency: "PLN",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
        amenities: ["Spa", "Pool", "WiFi", "Restaurant"]
    },
    {
        id: "h2",
        name: "Cozy Corner Inn",
        address: "Historic District, Old Town",
        pricePerNight: 280,
        currency: "PLN",
        rating: 4.2,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800",
        amenities: ["WiFi", "Breakfast", "Parking"]
    },
    {
        id: "h3",
        name: "Seaview Resort",
        address: "Beachfront Avenue",
        pricePerNight: 800,
        currency: "PLN",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1571896349842-6e5c48dc52e3?auto=format&fit=crop&q=80&w=800",
        amenities: ["Beach Access", "Pool", "Bar", "Gym"]
    },
    {
        id: "h4",
        name: "Budget Stay Hostel",
        address: "Near Train Station",
        pricePerNight: 120,
        currency: "PLN",
        rating: 3.5,
        image: "https://images.unsplash.com/photo-1555854743-e3c2f6a581ad?auto=format&fit=crop&q=80&w=800",
        amenities: ["WiFi", "Shared Kitchen", "Lockers"]
    },
    {
        id: "h5",
        name: "Business Executive Suites",
        address: "Financial District",
        pricePerNight: 550,
        currency: "PLN",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
        amenities: ["Business Center", "Gym", "Concierge"]
    }
];

// Helper to generate dynamic hotels
const generateHotelsForCity = (city: string): Hotel[] => {
    const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);

    return [
        {
            id: `dym-${city}-1`,
            name: `${capitalizedCity} Grand Hotel`,
            address: `Downtown ${capitalizedCity}, City Center`,
            pricePerNight: Math.floor(Math.random() * (800 - 300) + 300),
            currency: "PLN",
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
            amenities: ["Spa", "Pool", "WiFi", "Restaurant"]
        },
        {
            id: `dym-${city}-2`,
            name: `The ${capitalizedCity} View`,
            address: `${capitalizedCity} Bay Area`,
            pricePerNight: Math.floor(Math.random() * (1200 - 500) + 500),
            currency: "PLN",
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1571896349842-6e5c48dc52e3?auto=format&fit=crop&q=80&w=800",
            amenities: ["Ocean View", "Bar", "Pool", "Gym"]
        },
        {
            id: `dym-${city}-3`,
            name: `${capitalizedCity} City Hostel`,
            address: `Old Town, ${capitalizedCity}`,
            pricePerNight: Math.floor(Math.random() * (200 - 80) + 80),
            currency: "PLN",
            rating: 4.2,
            image: "https://images.unsplash.com/photo-1555854743-e3c2f6a581ad?auto=format&fit=crop&q=80&w=800",
            amenities: ["WiFi", "Shared Kitchen", "Lockers"]
        }
    ];
};

export async function searchHotels(city: string): Promise<Hotel[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    console.log(`Searching hotels in ${city}...`);

    if (city && city.trim().length > 0) {
        return generateHotelsForCity(city);
    }

    return MOCK_HOTELS;
}
