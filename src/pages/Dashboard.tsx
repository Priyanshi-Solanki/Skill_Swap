
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Clock, Star, MessageCircle, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const mockRequests = [
  {
    id: 1,
    type: "received",
    user: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
      rating: 4.9
    },
    offerSkill: "JavaScript",
    wantSkill: "Python",
    message: "Hi! I'd love to learn Python from you. I can teach you JavaScript in return.",
    status: "pending",
    date: "2024-01-15"
  },
  {
    id: 2,
    type: "sent",
    user: {
      name: "Marcus Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 4.8
    },
    offerSkill: "React",
    wantSkill: "UI Design",
    message: "I'm interested in learning UI design. Happy to share my React knowledge!",
    status: "accepted",
    date: "2024-01-14"
  }
];

const mockCompletedSwaps = [
  {
    id: 1,
    user: {
      name: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    skill: "Excel",
    rating: 5,
    feedback: "Excellent teacher! Very patient and knowledgeable.",
    date: "2024-01-10"
  },
  {
    id: 2,
    user: {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    skill: "Guitar",
    rating: 4,
    feedback: "Great session! Learned a lot about chord progressions.",
    date: "2024-01-08"
  }
];

const Dashboard = () => {
  const [requests, setRequests] = useState(mockRequests);

  const handleRequest = (requestId: number, action: 'accept' | 'reject') => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: action === 'accept' ? 'accepted' : 'rejected' }
        : req
    ));
    
    toast({
      title: action === 'accept' ? "Request accepted!" : "Request rejected",
      description: action === 'accept' 
        ? "You can now start your skill exchange!" 
        : "The request has been declined.",
    });
  };

  const stats = {
    totalSwaps: 12,
    averageRating: 4.8,
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    skillsTaught: 5
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Track your skill exchanges and manage requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalSwaps}</div>
              <div className="text-sm text-gray-500">Total Swaps</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <div className="text-sm text-gray-500">Average Rating</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.pendingRequests}</div>
              <div className="text-sm text-gray-500">Pending Requests</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.skillsTaught}</div>
              <div className="text-sm text-gray-500">Skills Taught</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="requests">Swap Requests</TabsTrigger>
            <TabsTrigger value="history">Swap History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="requests" className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={request.user.avatar} alt={request.user.name} />
                        <AvatarFallback>{request.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{request.user.name}</h3>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-500 ml-1">{request.user.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Offers: {request.offerSkill}
                          </Badge>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Wants: {request.wantSkill}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-2">{request.message}</p>
                        <p className="text-xs text-gray-400">Sent on {new Date(request.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {request.status === 'pending' && request.type === 'received' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleRequest(request.id, 'accept')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRequest(request.id, 'reject')}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {request.status === 'accepted' && (
                        <Badge className="bg-green-100 text-green-800">Accepted</Badge>
                      )}
                      
                      {request.status === 'rejected' && (
                        <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                      )}
                      
                      {request.status === 'pending' && request.type === 'sent' && (
                        <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {requests.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No swap requests yet. Start browsing skills to find your first exchange!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            {mockCompletedSwaps.map((swap) => (
              <Card key={swap.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={swap.user.avatar} alt={swap.user.name} />
                      <AvatarFallback>{swap.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{swap.user.name}</h3>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < swap.rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <Badge variant="secondary" className="mb-2">
                        Skill: {swap.skill}
                      </Badge>
                      
                      <p className="text-gray-600 text-sm mb-2">{swap.feedback}</p>
                      <p className="text-xs text-gray-400">Completed on {new Date(swap.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
