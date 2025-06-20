from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Team(models.Model):
    name = models.CharField(max_length=100)
    logo = models.URLField(blank=True)
    color = models.CharField(max_length=7, default="#000000")  # Hex color
    league = models.CharField(max_length=100)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Report(models.Model):
    STATUS_CHOICES = (
        ('not-started', 'Not Started'),
        ('in-progress', 'In Progress'),
        ('completed', 'Completed'),
    )

    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='reports')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not-started')
    key_players = models.JSONField(default=list)
    match_stats = models.JSONField(default=dict)
    tactical_summary = models.JSONField(default=dict)
    performance_insights = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('team', 'author')
        ordering = ['-updated_at']

    def __str__(self):
        return f"Report for {self.team.name} by {self.author.get_full_name() or self.author.email}" 