
angular.module('app.controllers', ['app.services'])

    // Path: /
    .controller('adminController', ['$scope', '$location', '$window', '$rootScope', '$adminService', '$timeout',
        function ($scope, $location, $window, $rootScope, $adminService, $timeout, $modal) {

            $scope.organizations = [];
            $scope.selectedOrgnizations = [];
            $scope.user = {};
            $scope.users = [];

            $scope.createUser = false;
            $scope.org = {};
            
            $scope.orgGridOptions = {
                data: 'organizations',
                columnDefs: [{ field: 'Name', displayName: 'Name' },
                             { field: 'Address', displayName: 'Address' },
                             { field: 'TotalInstanceOfDesigner', displayName: 'Max Designer' },
                             { field: 'TotalPlayerInstance', displayName: 'Max Player' },
                             { field: 'Phone', displayName: 'Phone' },
                             { field: 'Remark', displayName: 'Remark' }
                ],
                selectedItems: $scope.selectedOrgnizations,
                rowTemplate: '<div ng-click="populateUsers(row)" style="cursor:pointer" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div><div ng-cell></div></div>',
                multiSelect: false
            };

            $scope.usrGridOptions = {
                data: 'users',
                columnDefs: [{ field: 'UserName', displayName: 'Name' },
                             { field: 'UserId', displayName: 'Login Id' },
                             { field: 'Role', displayName: 'Role' }
                ],
                selectedItems: $scope.selectedUser,
                multiSelect: false
            };

            if ($("#hidIsAdminRole")[0].value == "True") {
                $scope.organizations.push({ Id: $("#hidOrgId")[0].value, Name: $("#hidOrgName")[0].value });
                $scope.selectedOrgnizations.push($scope.organizations[0]);
                $adminService.getUsers($("#hidOrgId")[0].value, function (data) {
                    $timeout(function () {
                        $scope.users = data;
                    }, 10);
                    
                });
            }

            $scope.getOrganizations = function () {
                $adminService.getOrganizations(function (data) {
                    $scope.organizations = data;
                });
            }

            $scope.getOrganizations();

            $adminService.getRoles(function (data) {
                $scope.roles = data;
            });

            $scope.$watch('selectedOrgnizations', function () {
                $adminService.getUsers($scope.selectedOrgnizations[0], function (data) {
                    $scope.users = data;
                });
            });

            

            $scope.populateUsers = function (row) {
                //if (row.selected) {
                $scope.selectedOrgIndex = row.rowIndex;;

                $adminService.getUsers($scope.organizations[$scope.selectedOrgIndex].Id, function (data) {
                    $scope.users = data;
                });
                //}
            };


            $scope.addOrganization = function () {
                
                $scope.createOrg = true;

                $("#OrgDialog").dialog("option", { title: 'Create Organization' });
                $("#OrgDialog").dialog('open');

                $scope.org = new Organization();
            };


            $scope.saveOrg = function () {
                $adminService.saveOrg($scope.org, function (data) {
                    $("#OrgDialog").dialog("close");
                    $scope.createOrg = false;
                    $scope.getOrganizations();
                });
            };

            $scope.editOrganization = function () {
                $scope.org = $scope.selectedOrgnizations[0];
                if ($scope.org) {
                    $("#OrgDialog").dialog("option", { title: 'Edit Organization' });
                    $("#OrgDialog").dialog('open');
                    $scope.editOrg = true;
                }
            };

            $scope.removeOrganization = function () {
                if ($scope.selectedOrgnizations.length > 0) {
                    
                    if (confirm("Are you sure you want to delete the selected Organization?")) {
                        var orgToDelete = $scope.selectedOrgnizations[0];
                        $adminService.deleteOrganization(orgToDelete, function (data) {
                            $scope.getOrganizations();
                        });
                        
                    }                    

                }
            };

            $scope.addUser = function () {
                if ($scope.selectedOrgnizations.length > 0) {
                    $("#UserDialog").dialog("open");
                    $scope.createUser = true;
                    $scope.user = new MediaUser();
                }
                else {
                    $scope.createUser = false;
                }
            };

            $scope.saveUser = function () {
                $scope.user.OrganizationId = $scope.selectedOrgnizations[0].Id;
                $adminService.saveUser($scope.user, function (data) {
                    $("#UserDialog").dialog("close");
                    $adminService.getUsers($scope.user.OrganizationId, function (users) {
                        $timeout(function () {
                            $scope.users = users;
                        }, 0);

                    });
                    //}


                });
            };

            $scope.cancelAddUser = function () {
                $("#UserDialog").dialog("close");
            };

            $scope.removeUser = function () {
            };

            

        }]
    );