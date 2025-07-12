
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  Ban, 
  CheckCircle, 
  Download, 
  MessageSquare, 
  Shield, 
  TrendingUp, 
  Users, 
  XCircle 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const mockReports = [
  {
    id: 1,
    type: "inappropriate_skill",
    reportedBy: "Sarah Chen",
    reportedUser: "John Smith",
    skill: "Adult Content Creation",
    reason: "Inappropriate skill description",
    status: "pending",
    date: "2024-01-15"
  },
  {
    id: 2,
    type: "user_behavior",
    reportedBy: "Marcus Johnson",
    reportedUser: "Jane Doe",
    reason: "Harassment in messages",
    status: "pending", 
    date: "2024-01-14"
  }
];

const mockUsers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    status: "active",
    joinDate: "2024-01-01",
    totalSwaps: 5,
    rating: 4.2
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    status: "active",
    joinDate: "2024-01-05",
    totalSwaps: 3,
    rating: 3.8
  }
];

const mockSwaps = [
  {
    id: 1,
    user1: "Sarah Chen",
    user2: "Marcus Johnson",
    skill1: "JavaScript",
    skill2: "UI Design",
    status: "completed",
    date: "2024-01-10"
  },
  {
    id: 2,
    user1: "Emily Rodriguez",
    user2: "David Kim",
    skill1: "Excel",
    skill2: "Guitar",
    status: "in_progress",
    date: "2024-01-12"
  }
];

const Admin = () => {
  const [reports, setReports] = useState(mockReports);
  const [users, setUsers] = useState(mockUsers);
  const [broadcastMessage, setBroadcastMessage] = useState("");

  const handleReport = (reportId: number, action: 'approve' | 'reject') => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: action === 'approve' ? 'approved' : 'rejected' }
        : report
    ));
    
    toast({
      title: action === 'approve' ? "Report approved" : "Report rejected",
      description: `The report has been ${action}d successfully.`,
    });
  };

  const handleUserAction = (userId: number, action: 'ban' | 'unban') => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: action === 'ban' ? 'banned' : 'active' }
        : user
    ));
    
    toast({
      title: action === 'ban' ? "User banned" : "User unbanned",
      description: `The user has been ${action}ned successfully.`,
    });
  };

  const sendBroadcast = () => {
    if (!broadcastMessage.trim()) return;
    
    toast({
      title: "Message sent!",
      description: "Your broadcast message has been sent to all users.",
    });
    setBroadcastMessage("");
  };

  const downloadReport = (type: string) => {
    toast({
      title: "Download started",
      description: `Downloading ${type} report...`,
    });
  };

  const stats = {
    totalUsers: 156,
    activeSwaps: 23,
    pendingReports: reports.filter(r => r.status === 'pending').length,
    completedSwaps: 89
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage the SkillSwap platform</p>
          </div>
          <Shield className="h-12 w-12 text-blue-600" />
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <div className="text-sm text-gray-500">Total Users</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.activeSwaps}</div>
              <div className="text-sm text-gray-500">Active Swaps</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.pendingReports}</div>
              <div className="text-sm text-gray-500">Pending Reports</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.completedSwaps}</div>
              <div className="text-sm text-gray-500">Completed Swaps</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="swaps">Swaps</TabsTrigger>
            <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Reports</CardTitle>
                <CardDescription>Review and moderate reported content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary">
                              {report.type.replace('_', ' ')}
                            </Badge>
                            <Badge variant={report.status === 'pending' ? 'default' : 'secondary'}>
                              {report.status}
                            </Badge>
                          </div>
                          
                          <p className="font-medium">Reported User: {report.reportedUser}</p>
                          <p className="text-sm text-gray-600">Reported by: {report.reportedBy}</p>
                          {report.skill && (
                            <p className="text-sm text-gray-600">Skill: {report.skill}</p>
                          )}
                          <p className="text-sm text-gray-600">Reason: {report.reason}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Reported on {new Date(report.date).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {report.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleReport(report.id, 'approve')}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Take Action
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReport(report.id, 'reject')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Dismiss
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between border rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span>Joined: {new Date(user.joinDate).toLocaleDateString()}</span>
                            <span>Swaps: {user.totalSwaps}</span>
                            <span>Rating: {user.rating}/5</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                          {user.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant={user.status === 'active' ? 'destructive' : 'default'}
                          onClick={() => handleUserAction(user.id, user.status === 'active' ? 'ban' : 'unban')}
                        >
                          <Ban className="h-4 w-4 mr-1" />
                          {user.status === 'active' ? 'Ban' : 'Unban'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="swaps" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Swap Activity</CardTitle>
                <CardDescription>Monitor all skill exchanges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSwaps.map((swap) => (
                    <div key={swap.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{swap.user1} ↔ {swap.user2}</p>
                          <p className="text-sm text-gray-600">
                            {swap.skill1} for {swap.skill2}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(swap.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={
                          swap.status === 'completed' ? 'default' : 
                          swap.status === 'in_progress' ? 'secondary' : 'destructive'
                        }>
                          {swap.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="broadcast" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Broadcast</CardTitle>
                <CardDescription>Send messages to all users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Type your message to all users..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  rows={4}
                />
                <Button onClick={sendBroadcast} className="bg-blue-600 hover:bg-blue-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Broadcast Message
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>Download reports and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => downloadReport('user_activity')}
                    className="h-20 flex-col"
                  >
                    <Download className="h-6 w-6 mb-2" />
                    User Activity Report
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => downloadReport('swap_statistics')}
                    className="h-20 flex-col"
                  >
                    <Download className="h-6 w-6 mb-2" />
                    Swap Statistics
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => downloadReport('feedback_analysis')}
                    className="h-20 flex-col"
                  >
                    <Download className="h-6 w-6 mb-2" />
                    Feedback Analysis
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => downloadReport('platform_overview')}
                    className="h-20 flex-col"
                  >
                    <Download className="h-6 w-6 mb-2" />
                    Platform Overview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;
