from django.shortcuts import render

# Create your views here.
import json
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.conf import settings

class SystemInfoView(APIView):
    """
    Read system_info.json (created by agent) and return as API response
    """

    def get(self, request):
      
        file_path = os.path.join(settings.BASE_DIR, "agent", "system_info.json")

        if not os.path.exists(file_path):
            return Response(
                {"error": "system_info.json not found. Run the agent first."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            with open(file_path, "r") as f:
                data = json.load(f)
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# from django.views.generic import TemplateView

# class FrontendView(TemplateView):
#     template_name = "monitor/index.html"
