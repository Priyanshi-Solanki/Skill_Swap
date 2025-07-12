
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, X, Camera, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    location: "",
    bio: "Passionate about technology and always eager to learn new skills while sharing what I know.",
    availability: "weekends",
    isPublic: true,
    avatar: ""
  });

  const [offeredSkills, setOfferedSkills] = useState<string[]>([]);
  const [wantedSkills, setWantedSkills] = useState<string[]>([]);
  const [newOfferedSkill, setNewOfferedSkill] = useState("");
  const [newWantedSkill, setNewWantedSkill] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        location: user.location || "",
        bio: "Passionate about technology and always eager to learn new skills while sharing what I know.",
        availability: user.availability || "weekends",
        isPublic: user.isPublic !== undefined ? user.isPublic : true,
        avatar: user.avatar || ""
      });
    }
  }, [user]);

  // Load user skills from database
  useEffect(() => {
    if (user) {
      loadUserSkills();
    }
  }, [user]);

  const loadUserSkills = async () => {
    try {
      const token = localStorage.getItem('skillswap_token');
      const response = await fetch(`${API_URL}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const userSkills = data.user.skills || [];
        const offered = userSkills.filter((skill: any) => skill.type === 'offered').map((skill: any) => skill.name);
        const wanted = userSkills.filter((skill: any) => skill.type === 'wanted').map((skill: any) => skill.name);
        setOfferedSkills(offered);
        setWantedSkills(wanted);
      }
    } catch (error) {
      console.error('Error loading skills:', error);
    }
  };

  const addSkill = async (type: 'offered' | 'wanted') => {
    const newSkill = type === 'offered' ? newOfferedSkill : newWantedSkill;
    if (!newSkill.trim()) return;

    try {
      const token = localStorage.getItem('skillswap_token');
      
      // Get current user profile
      const profileResponse = await fetch(`${API_URL}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        const currentSkills = profileData.user.skills || [];
        
        // Add new skill
        const updatedSkills = [...currentSkills, {
          name: newSkill.trim(),
          type
        }];
        
        // Update user profile with new skills
        const updateResponse = await fetch(`${API_URL}/api/user/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            skills: updatedSkills
          })
        });

        if (updateResponse.ok) {
          if (type === 'offered') {
            setOfferedSkills([...offeredSkills, newSkill.trim()]);
            setNewOfferedSkill("");
          } else {
            setWantedSkills([...wantedSkills, newSkill.trim()]);
            setNewWantedSkill("");
          }
          toast({
            title: "Skill added!",
            description: `${newSkill.trim()} has been added to your ${type} skills.`,
          });
        }
      }
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
        variant: "destructive"
      });
    }
  };

  const removeSkill = async (type: 'offered' | 'wanted', skillToRemove: string) => {
    try {
      const token = localStorage.getItem('skillswap_token');
      
      // Get current user profile
      const profileResponse = await fetch(`${API_URL}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        const currentSkills = profileData.user.skills || [];
        
        // Remove the skill
        const updatedSkills = currentSkills.filter((skill: any) => 
          !(skill.name === skillToRemove && skill.type === type)
        );
        
        // Update user profile with updated skills
        const updateResponse = await fetch(`${API_URL}/api/user/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            skills: updatedSkills
          })
        });
        
        if (updateResponse.ok) {
          // Reload skills after deletion
          loadUserSkills();
          toast({
            title: "Skill removed!",
            description: `${skillToRemove} has been removed from your ${type} skills.`,
          });
        }
      }
    } catch (error) {
      console.error('Error removing skill:', error);
      toast({
        title: "Error",
        description: "Failed to remove skill. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('skillswap_token');
      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('Profile data to save:', {
        name: profile.name,
        location: profile.location,
        availability: profile.availability,
        isPublic: profile.isPublic
      });

      const success = await updateProfile({
        name: profile.name,
        location: profile.location,
        availability: profile.availability,
        isPublic: profile.isPublic
      });

      if (success) {
        toast({
          title: "Profile updated!",
          description: "Your profile information has been successfully saved.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: `Failed to update profile: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSkills = async () => {
    toast({
      title: "Skills saved!",
      description: "Your skills are automatically saved when you add or remove them.",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h1>
          <Button onClick={() => window.location.href = '/'}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your skill swap profile and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input
                    id="location"
                    placeholder="City, State/Country"
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell others about yourself and your learning goals..."
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Select value={profile.availability} onValueChange={(value) => setProfile({...profile, availability: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekdays">Weekdays</SelectItem>
                      <SelectItem value="weekends">Weekends</SelectItem>
                      <SelectItem value="evenings">Evenings</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="public"
                    checked={profile.isPublic}
                    onCheckedChange={(checked) => setProfile({...profile, isPublic: checked})}
                  />
                  <Label htmlFor="public">Make profile public</Label>
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  💾 This saves your name, location, availability, and privacy settings
                </div>

                <Button onClick={handleSave} disabled={isLoading} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Profile Changes"}
                </Button>
              </CardContent>
            </Card>

            {/* Skills I Can Offer */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Skills I Can Teach</CardTitle>
                <CardDescription>Add skills you can share with others</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {offeredSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-green-100 text-green-800">
                      {skill}
                      <button
                        onClick={() => removeSkill('offered', skill)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Add a skill you can teach..."
                    value={newOfferedSkill}
                    onChange={(e) => setNewOfferedSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill('offered')}
                  />
                  <Button onClick={() => addSkill('offered')} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  💡 Skills are automatically saved when you add or remove them
                </div>
              </CardContent>
            </Card>

            {/* Skills I Want to Learn */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-700">Skills I Want to Learn</CardTitle>
                <CardDescription>Add skills you'd like to learn from others</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {wantedSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-blue-100 text-blue-800">
                      {skill}
                      <button
                        onClick={() => removeSkill('wanted', skill)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Add a skill you want to learn..."
                    value={newWantedSkill}
                    onChange={(e) => setNewWantedSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill('wanted')}
                  />
                  <Button onClick={() => addSkill('wanted')} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  💡 Skills are automatically saved when you add or remove them
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Preview</CardTitle>
                <CardDescription>How others will see your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <Avatar className="w-16 h-16 mx-auto">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{profile.name}</h3>
                    <p className="text-sm text-gray-500">{profile.location}</p>
                  </div>
                  <p className="text-sm text-gray-600">{profile.bio}</p>
                  <div className="text-left space-y-2">
                    <p className="text-sm font-medium">Can teach:</p>
                    <div className="flex flex-wrap gap-1">
                      {offeredSkills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs bg-green-100 text-green-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm font-medium">Wants to learn:</p>
                    <div className="flex flex-wrap gap-1">
                      {wantedSkills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
