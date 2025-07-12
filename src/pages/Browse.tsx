
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, Star, MessageCircle, Clock, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface User {
  _id: string;
  name: string;
  location: string;
  profile_photo: string;
  skills: Array<{
    name: string;
    type: 'offered' | 'wanted';
  }>;
  swapCount: number;
  averageRating: number;
}

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from backend
  const fetchUsers = async (skill?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const url = skill 
        ? `${API_URL}/api/users/browse?skill=${encodeURIComponent(skill)}`
        : `${API_URL}/api/users/browse`;
      
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      setUsers(data.users);
      setFilteredUsers(data.users);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error fetching users:', err);
      setError(`Failed to load users: ${errorMessage}`);
      toast({
        title: "Error",
        description: `Failed to load users: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle search
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    
    if (term.trim()) {
      // Search on Enter or after typing
      await fetchUsers(term);
    } else {
      // Clear search - show all users
      await fetchUsers();
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm);
    }
  };

  // Get offered skills for a user
  const getOfferedSkills = (user: User) => {
    if (!user.skills || !Array.isArray(user.skills)) {
      return [];
    }
    return user.skills.filter(skill => skill.type === 'offered').map(skill => skill.name);
  };

  // Get wanted skills for a user
  const getWantedSkills = (user: User) => {
    if (!user.skills || !Array.isArray(user.skills)) {
      return [];
    }
    return user.skills.filter(skill => skill.type === 'wanted').map(skill => skill.name);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <Button onClick={() => fetchUsers()}>
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Skills</h1>
          <p className="text-gray-600 mb-6">Find the perfect skill exchange partner</p>
          
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search skills (e.g., Python, JavaScript)..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button 
              size="sm" 
              className="absolute right-1 top-1"
              onClick={() => handleSearch(searchTerm)}
            >
              Search
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading users...</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <Card key={user._id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.profile_photo} alt={user.name} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{user.location || 'Location not specified'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">
                        {user.averageRating > 0 ? user.averageRating.toFixed(1) : 'No ratings'}
                      </span>
                      <span className="text-sm text-gray-500">({user.swapCount || 0} swaps)</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-2">Can teach:</p>
                      <div className="flex flex-wrap gap-1">
                        {getOfferedSkills(user).map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-green-100 text-green-800">
                            {skill}
                          </Badge>
                        ))}
                        {getOfferedSkills(user).length === 0 && (
                          <span className="text-sm text-gray-500">No skills offered</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-blue-700 mb-2">Wants to learn:</p>
                      <div className="flex flex-wrap gap-1">
                        {getWantedSkills(user).map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-blue-100 text-blue-800">
                            {skill}
                          </Badge>
                        ))}
                        {getWantedSkills(user).length === 0 && (
                          <span className="text-sm text-gray-500">No skills wanted</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Swap Request
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm ? `No users found teaching "${searchTerm}".` : 'No users available.'}
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  fetchUsers();
                }}
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Browse;

