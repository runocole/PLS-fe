from rest_framework import serializers
from .models import Report
from teams.serializers import TeamSerializer

class ReportSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    team_logo = serializers.CharField(source='team.logo', read_only=True)
    team_color = serializers.CharField(source='team.color', read_only=True)
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    team = TeamSerializer(read_only=True)
    team_id = serializers.PrimaryKeyRelatedField(source='team', write_only=True, queryset=Team.objects.all())

    class Meta:
        model = Report
        fields = [
            'id', 'team', 'team_id', 'team_name', 'team_logo', 'team_color',
            'author', 'author_name', 'status', 'key_players', 'match_stats',
            'tactical_summary', 'performance_insights', 'created_at', 'updated_at'
        ]
        read_only_fields = ['author', 'created_at', 'updated_at']

    def create(self, validated_data):
        team = validated_data.pop('team')
        report = Report.objects.create(team=team, **validated_data)
        return report 