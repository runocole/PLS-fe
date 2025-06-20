from rest_framework import serializers
from .models import Team, Report

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name', 'logo', 'color', 'league', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['created_by', 'created_at', 'updated_at']

class ReportSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    team_logo = serializers.URLField(source='team.logo', read_only=True)
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)

    class Meta:
        model = Report
        fields = [
            'id', 'team', 'team_name', 'team_logo', 'author', 'author_name',
            'status', 'key_players', 'match_stats', 'tactical_summary',
            'performance_insights', 'created_at', 'updated_at'
        ]
        read_only_fields = ['author', 'created_at', 'updated_at'] 