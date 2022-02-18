
//// Demonstrate how to register services
//// In this case it is a simple value service.
angular.module('app.services', [])
    
    .factory('$adminService', ['$http', function ($http) {
        return {
            getOrganizations: function (callback) {
                var srvUrl = './GetOrganizations';

                $http.get(srvUrl).
                    success(function (data) {
                        callback(data);
                    }).
                    error(function (error) {
                    });
            },
            deleteOrganization: function (org, callback) {
                var srvUrl = './DeleteOrganization';
                $http.post(srvUrl, org).
                    success(function (data) {
                        callback(data);
                    }).
                    error(function (error) {
                    });
            },
            getRoles: function (callback) {
                var srvUrl = './GetRoles';

                $http.get(srvUrl).
                    success(function (data) {
                        callback(data);
                    }).
                    error(function (error) {
                    });
            },
            saveUser: function (user, callback) {
                var srvUrl = './SaveUser';

                $http.post(srvUrl, user).
                    success(function (data) {
                        callback(data);
                    }).
                    error(function (error) {
                    });
            },
            getUsers: function (orgId, callback) {
                var srvUrl = './GetUsers?orgId=' + orgId;

                $http.get(srvUrl).
                    success(function (data) {
                        callback(data);
                    }).
                    error(function (error) {
                    });
            },
            saveOrg: function (org, callback) {
                var srvUrl = './SaveOrganization';

                $http.post(srvUrl, org).
                    success(function (data) {
                        callback(data);
                    }).
                    error(function (error) {
                    });
            }

        }
    }]);